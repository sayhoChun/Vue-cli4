<template>
    <div class="content">
        <div class="chat-container">
            <Chat v-if="visible"
                  :participants="participants"
                  :myself="myself"
                  :messages="messages"
                  :chat-title="chatTitle"
                  :placeholder="placeholder"
                  :colors="colors"
                  :border-style="borderStyle"
                  :hide-close-button="hideCloseButton"
                  :close-button-icon-size="closeButtonIconSize"
                  :submit-icon-size="submitIconSize"
                  :load-more-messages="toLoad.length > 0 ? loadMoreMessages : null"
                  :async-mode="asyncMode"
                  :scroll-bottom="scrollBottom"
                  :display-header="true"
                  :send-images="true"
                  :profile-picture-config="profilePictureConfig"
                  @onImageClicked="onImageClicked"
                  @onImageSelected="onImageSelected"
                  @onMessageSubmit="onMessageSubmit"
                  @onType="onType"
                  @onClose="onClose"
            />
        </div>
    </div>
</template>

<script>
    import {Chat} from 'vue-quick-chat';
    import 'vue-quick-chat/dist/vue-quick-chat.css';

    export default {
        components: {Chat},
        data() {
            return {
                timeout: null,
                status: "disconnected",
                logs: [],

                intervalId: null,
                roomId: null,
                visible: true,
                participants: [],
                myself: {},
                messages: [],
                chatTitle: null,
                placeholder: 'send your message',
                colors: {
                    header: {bg: '#343a40', text: '#fff'},
                    message: {
                        myself: {bg: '#343a40', text: '#fff'},
                        // others: {bg: '#fff', text: '#bdb8b8'},
                        others: {bg: '#fff', text: '#343a40'},
                        messagesDisplay: {bg: '#f7f3f3'}
                    },
                    // submitIcon: '#b91010',
                    // submitImageIcon: '#b91010',
                    submitIcon: '#343a40',
                    submitImageIcon: '#343a40',
                },
                borderStyle: {
                    topLeft: "10px",
                    topRight: "10px",
                    bottomLeft: "10px",
                    bottomRight: "10px",
                },
                hideCloseButton: true,
                submitIconSize: 25,
                closeButtonIconSize: "20px",
                asyncMode: false,
                toLoad: [],
                scrollBottom: {
                    messageSent: true,
                    messageReceived: true
                },
                displayHeader:true,
                profilePictureConfig: {
                    others: false,
                    myself: false,
                    styles: {
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%'
                    }
                }
            }
        },
        mounted(){
            if(!this.$store.getters.isLoggedIn){
                this.$swal({
                    text: "로그인 후 이용 바랍니다.",
                    icon: 'warning',
                    backdrop: "#696969",
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                }).then((result) => {
                    if(result.value){
                        this.$router.push("/");
                    }
                })
            }else{
                this.$scrollLock.enable();
                this.provider();
                this.connect();
            }
        },
        beforeRouteLeave(to, from, next){
            clearInterval(this.intervalId);
            this.disconnect();
            next();
        },
        methods: {
            waitForConnection(callback, interval){
                let state = this.socket.readyState;
                if(state === 1) callback();
                else setTimeout(() => {
                    if(state !== 0) this.connect();
                    this.waitForConnection(callback, interval)
                }, interval)
            },
            connect(){
                this.socket = new WebSocket(
                    `${this.CONSTANTS.WEB_SOCKET_URL}?uId=${this.$store.getters.getToken.id}&rId=${this.$route.params.id}&name=${this.$store.getters.getToken.name}&account=${this.$store.getters.getToken.account}&phone=${this.$store.getters.getToken.phone}`
                );
                this.socket.onopen = () => {
                    this.intervalId = setInterval(this.ping, 30000);
                    this.status = "connected";
                    this.logs.push({event: "connection established", data: this.CONSTANTS.WEB_SOCKET_URL});
                    this.socket.onmessage = ({data}) => {
                        // let jsonData = JSON.parse(data);
                        let message = JSON.parse(data)["userMessage"];
                        console.log(message);
                        if(message === '__pong__' || message === '__ping__') this.pong();
                        else{
                            this.provider();
                            console.log({event: "message received", data: data});
                            this.logs.push({event: "message received", data: data})
                        }

                    }
                }
            },
            disconnect(){
                this.socket.close();
                this.status = "disconnected";
                this.logs = [];
            },
            sendMessage(msg, callback){
                this.waitForConnection(() => {
                    this.socket.send(msg);
                    this.logs.push({event: "message sent", data: msg});
                }, 1000)
                callback();
            },
            ping(){
                console.log("__ping__")
                this.waitForConnection(() => {
                    this.socket.send('__ping__');
                    this.timeout = setTimeout(() => {}, 5000);
                }, 1000)
            },
            pong(){clearTimeout(this.timeout)},
            provider(){
                let promise = this.$http.get(`${this.CONSTANTS.API_URL}/dummy/info/chat/${this.$route.params.id}`);
                return promise.then(res => {
                    let myself = this.$store.getters.getToken.id;
                    let data = res.data.data;
                    let memberList = data["memberList"];
                    let messageList = data["messageList"];
                    let roomInfo = data["roomInfo"];

                    this.participants = [];
                    memberList.forEach(item => {
                        item["id"] = item.userId;
                        if(item.userId === myself) this.myself = item;
                        else this.participants.push(item);
                    });

                    messageList.forEach(item => {
                        item["myself"] = item.userId === myself;
                        item["participantId"] = item.userId;
                        item["src"] = this.CONSTANTS.IMG_URL + "/" + item["src"];
                        item["uploaded"] = true;
                    });
                    this.messages = messageList;
                    this.roomId = roomInfo["id"];
                    this.chatTitle = roomInfo["name"];

                    let container = this.$el.querySelector(".container-message-display");
                    container.scrollTop = container.scrollHeight;
                })
                    .catch(err => {
                        this.$swal({
                            icon: "error",
                            title: "Oops ...",
                            text: err
                        }).then(res => {if(res) return []});
                    })
            },
            onType: function(event){
                //here you can set any behavior
                console.log(event);
            },
            loadMoreMessages(resolve) {
                setTimeout(() => {
                    resolve(this.toLoad); //We end the loading state and add the messages
                    //Make sure the loaded messages are also added to our local messages copy or they will be lost
                    this.messages.unshift(...this.toLoad);
                    this.toLoad = [];
                }, 1000);
            },
            onMessageSubmit(message){
                console.log(message);
                this.messages.push(message);
                this.$http.post(`${this.CONSTANTS.API_URL}/dummy/chat/message/add/${message.participantId}`, this.qs.stringify({
                    roomId: this.roomId,
                    content: message.content,
                    imgPath: null,
                    type: 1
                }))
                .then(res => {
                    console.log(res);
                    this.sendMessage(message.content, () => {
                        message.uploaded = true
                    });
                })
            },
            onClose() {this.visible = false},
            onImageSelected(files){
                console.log(files);
                var formData = new FormData();
                formData.append("uploadImg", files.file);
                this.$http.post(`${this.CONSTANTS.API_URL}/imgUpload`, formData, {
                    headers: {"Content-Type": "multipart/form-data"}
                })
                .then(res => {
                    console.log(res);
                    let path = res.data.data.replace("img_upload/", "");
                    let src = `${this.CONSTANTS.IMG_URL}/${path}`;
                    this.$http.post(`${this.CONSTANTS.API_URL}/dummy/chat/message/add/${this.$store.getters.getToken.id}`,
                    this.qs.stringify({
                        roomId: this.roomId,
                        content: null,
                        imgPath: path,
                        type: 2
                    }))
                    .then(res2 => {
                        if(res2.data["returnCode"] === 1){
                            console.log(path);
                            this.messages.push(files.message);
                            files.message.src = src;
                            this.sendMessage("image", () => {
                                files.message.uploaded = true;
                            })
                        }
                    })
                })
            },
            onImageClicked(message){
                /**
                 * This is the callback function that is going to be executed when some image is clicked.
                 * You can add your code here to do whatever you need with the image clicked.
                 * A common situation is to display the image clicked in full screen.
                 */
                console.log('Image clicked', message.src)
            }
        }
    }
</script>

<style>
    .content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }
    .chat-container {
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgb(247, 243, 243);
        /*height: 92vh;*/
        height: 75vh;
        width: 100vw;
    }
    .message-username{white-space: nowrap !important;}
    .container-message-display .other-message-body .message-text{max-width: 100%;}
    .container-message-display .myself-message-body .message-text{max-width: 100%;}
</style>