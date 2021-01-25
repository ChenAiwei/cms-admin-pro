
<template>
    <div class="footer_components flexC">
        <div class="flexR">
          
        </div>
        <div class="flexR">
            <span>Copyright © {{year}} CMS-Admin Pro</span>
        </div>
    </div>

</template>

<script>
    export default {
        name: "footer_components",
        data(){
            return {
                year: ''
            }
        },
        created() {
            let date = new Date
            this.year = date.getFullYear()
        }
    }
</script>

<style lang="less">
    .footer_components {
        margin: 40px 0 15px 0;
        justify-content: center;
        align-items: center;
        a{
            color: #515a6e;
            &:hover{
                color: #1890FF;
            }
        }
        span{
            color: #515a6e;
        }
        &>div:first-child{
            span{
                margin-right: 15px;
            }
            margin-bottom: 5px;
        }
    }
</style>
