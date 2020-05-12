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
        components: {
            Chat
        },
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
                    header: {bg: '#d30303', text: '#fff'},
                    message: {
                        myself: {bg: '#fff', text: '#bdb8b8'},
                        others: {bg: '#fb4141', text: '#fff'},
                        messagesDisplay: {bg: '#f7f3f3'}
                    },
                    submitIcon: '#b91010',
                    submitImageIcon: '#b91010',
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
                // this.startPolling();
                this.connect();
            }

            console.log(this.$store.getters.getToken);
        },
        beforeRouteLeave(to, from, next){
            clearInterval(this.intervalId);
            this.disconnect();
            next();
        },
        methods: {
            connect(){
                this.socket = new WebSocket(
                    `${this.CONSTANTS.WEB_SOCKET_URL}?uId=${this.$store.getters.getToken.id}&rId=${this.$route.params.id}&name=${this.$store.getters.getToken.name}&account=${this.$store.getters.getToken.account}&phone=${this.$store.getters.getToken.phone}`
                );
                this.socket.onopen = () =>{
                    setInterval(this.ping, 30000);
                    this.status = "connected";
                    this.logs.push({event: "connection established", data: "ws://localhost:10060/socket"});
                    this.socket.onmessage = ({data}) => {
                        if(data.data === '__pong__'){
                            this.pong();
                            return;
                        }
                        this.provider();
                        console.log({event: "message received", data: data});
                        this.logs.push({event: "message received", data: data})
                    }
                }
            },
            disconnect(){
                this.socket.close();
                this.status = "disconnected";
                this.logs = [];
            },
            sendMessage(msg){
                this.socket.send(msg);
                this.logs.push({event: "message sent", data: msg});
            },
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
                        item["type"] = "text";
                    });
                    this.messages = messageList;
                    this.roomId = roomInfo["id"];
                    this.chatTitle = roomInfo["name"];
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
                    content: message.content
                }))
                .then(res => {
                    console.log(res);
                    this.provider();
                    this.sendMessage(message.content);
                })
                /*
                * you can update message state after the server response
                */
                // timeout simulating the request
                setTimeout(() => {
                    message.uploaded = true
                }, 2000)
            },
            onClose() {
                this.visible = false;
            },
            onImageSelected(files, message){
                let src = 'https://149364066.v2.pressablecdn.com/wp-content/uploads/2017/03/vue.jpg'
                this.messages.push(message);
                /**
                 * This timeout simulates a requisition that uploads the image file to the server.
                 * It's up to you implement the request and deal with the response in order to
                 * update the message status and the message URL
                 */
                setTimeout((res) => {
                    message.uploaded = true
                    message.src = res.src
                }, 3000, {src});
            },
            onImageClicked(message){
                /**
                 * This is the callback function that is going to be executed when some image is clicked.
                 * You can add your code here to do whatever you need with the image clicked.
                 * A common situation is to display the image clicked in full screen.
                 */
                console.log('Image clicked', message.src)
            },
            startPolling(){
                this.intervalId = setInterval(this.provider, 2000);
            },
            ping(){
                this.socket.send('__ping__');
                this.timeout = setTimeout(() => {

                }, 5000);
            },
            pong(){
                clearTimeout(this.timeout);
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