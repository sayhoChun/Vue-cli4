import { store } from "../../store/index";

export default{
    install: ((Vue, /*option*/) => {
// 1. 전역 메소드 또는 속성 추가
        Vue.authCheck = () => {
            if(!store.getters.isLoggedIn){
                this.$swal({
                    text: "로그인 후 이용 바랍니다.",
                    icon: 'warning',
                    backdrop: "#696969",
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                }).then((result) => {
                    return !!result.value;
                })
            }
        }

        // // 2. 전역 에셋 추가
        // Vue.directive('my-directive', {
        //     bind (el, binding, vnode, oldVnode) {
        //         // 필요한 로직 ...
        //     }
        // })
        //
        // // 3. 컴포넌트 옵션 주입
        // Vue.mixin({
        //     created: function () {
        //         // 필요한 로직 ...
        //     }
        // })
        //
        // 4. 인스턴스 메소드 추가
        Vue.prototype.$authCheck =() => {
            if(!store.getters.isLoggedIn){
                this.$swal({
                    text: "로그인 후 이용 바랍니다.",
                    icon: 'warning',
                    backdrop: "#696969",
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                }).then((result) => {
                    return !!result.value;
                })
            }
        }
    })
}