let mixin = {
    props: {
        weight:{
            default: 10
        }
    },
    created(){
        console.log('mixin')
    },
    methods: {
        onClick(){
            this.data++;
        }
    }
};
export default mixin;
