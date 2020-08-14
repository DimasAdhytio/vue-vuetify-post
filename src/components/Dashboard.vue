<template>
    <v-main class="background">
        <v-toolbar dark>
            <v-toolbar-title role="button">
                <v-avatar color="grey" tile width="130px" height="40px" class="title-font">
                    Post.me
                </v-avatar>
            </v-toolbar-title>
            <v-menu offset-y>
                <template v-slot:activator="{on, attrs}">
                    <v-btn v-on="on" v-bind="attrs" class="ml-auto text-capitalize">{{username.username}} <v-icon>mdi-menu-down</v-icon></v-btn>
                </template>
                <v-list>
                    <v-list-item link @click="onLogout()">Logout</v-list-item>
                </v-list>
            </v-menu>
        </v-toolbar>
        <v-container>
            <v-row>
                <v-col>
                    <v-card
                        class="mx-auto"
                    >
                        <v-card-title class="white--text grey darken-4">
                        Post View

                        <v-spacer></v-spacer>

                        <v-btn
                            color="grey"
                            dark
                            small
                            fab=""
                            @click="modPostEd()"
                        >
                        <v-icon>mdi-plus</v-icon>
                        </v-btn>
                        </v-card-title>

                        <v-divider></v-divider>

                        <v-virtual-scroll
                        :items="this.$store.state.post"
                        :item-height="165"
                        height="500"
                        >
                        <template v-slot="{ item }">
                            <v-list-item :class="{grey : item.id % 2 == 0}">
                                <v-list-item-content>
                                    <v-list-item-subtitle class="text-truncate">
                                            {{ item.id }} | {{ item.username }}
                                    </v-list-item-subtitle>                                    
                                    <v-row>
                                        <v-col>
                                            {{ item.title }}
                                        </v-col>
                                        <v-col class="text-right">
                                            <v-btn fab x-small class="mr-6 warning lighten-1" elevation="0" @click="modPostEd(item.id)">
                                                <v-icon class="mdi-light">mdi-download</v-icon>
                                            </v-btn>
                                            <v-btn fab x-small class="mr-6 red lighten-1" elevation="0" @click="modDel(item.id)">
                                                <v-icon class="mdi-light">mdi-close</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                    <hr>
                                    <v-row>
                                        <v-col style="height:60px" :class="$vuetify.breakpoint.mdAndDown ? 'text-truncate' : ' '">
                                            {{ item.body }}
                                        </v-col>
                                    </v-row>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                        </v-virtual-scroll>
                        <v-card-text class="grey darken-4 white--text">
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <!-- delete -->
        <v-dialog v-model="delMod" max-width="50%">
            <v-card>
                <v-card-title class="white--text red">
                    Warning !
                </v-card-title>
                <v-card-text class="mt-4">
                    Are you sure want to delete this post ?
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="">
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="delPost()">Yes</v-btn>
                    <v-btn color="red" class="white--text" @click="modDel">Nope</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- post&edit -->
        <v-dialog v-model="postEdMod" max-width="70%">
            <v-card>
                <v-card-title class="white--text" :class="edit ? 'warning' : 'success'">
                    <div v-if="edit">Edit | ID : {{ temp_id }}</div>
                    <div v-else>Post input</div>
                </v-card-title>
                <v-card-text class="mt-4">
                    <v-form @submit.prevent="">
                        <v-text-field
                            color="white"
                            hide-details
                            solo
                            label="Title"
                            class="mb-4"
                            height="10px"
                            v-model="post.title"
                        ></v-text-field>
                        <v-textarea
                            solo
                            label="Post ...."
                            v-model="post.text"
                        ></v-textarea>
                    </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" class="white--text ml-2" @click="clearPost()">Clear</v-btn>
                    <v-btn v-if="edit" color="warning" @click="edPost()">Edit</v-btn>
                    <v-btn v-else color="success" @click="inPost()">Post</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-main>
</template>

<script>
export default {
    data() {
        return {
            postEdMod: false,
            delMod: false,
            temp_id: null,
            edit: false,
            post: {
                id: null,
                title: '',
                text: ''
            }
        }
    },
    mounted() {
        this.$store.dispatch('takePost')
    },
    computed: {
        showPost() {
            if(this == null) {
                return this.$store.getters.post
            }else{
                return null
            }
        },
        username() {
            if(this.$store.getters.dataUser != null) {
                return this.$store.getters.dataUser
            }else{
                return 0
            }
        }
    },
    methods: {
        onLogout() {
            this.$store.dispatch('logout')
            .then(response => {
                this.$router.push({name:'Login'})
                console.log(response);
            })
        },
        modPostEd(Id) {
            this.postEdMod = !this.postEdMod
            if(Id != undefined) {
                const index = this.$store.state.post.findIndex(item => item.id == Id)
                const temp_fill = this.$store.state.post[index]
                this.post.id = temp_fill.id
                this.post.title = temp_fill.title
                this.post.text = temp_fill.body
                this.edit = true
            }
        },
        modDel(Id) {
            if(this.temp_id == null) {
                this.temp_id = Id
            }else{
                this.temp_id = null
            }
            this.delMod = !this.delMod
        },
        delPost() {
            this.delMod = !this.delMod
            const index = this.$store.state.post.findIndex(items => items.id == this.temp_id)
            this.$store.dispatch('delPost', index)
        },
        inPost() {
            if(this.post.title == '' || this.post.title == '') {
                alert('Please dont let the post empty.')
            }else{
                this.$store.dispatch('inPost',{
                    title: this.post.title,
                    text: this.post.text
                })
                this.clearPost()
                this.postEdMod = false
            }
        },edPost() {
            if(this.post.title == '' || this.post.title == '') {
                alert('Please dont let the post empty.')
            }else{
                this.$store.dispatch('edPost',{
                    id: this.post.id,
                    title: this.post.title,
                    text: this.post.text
                })
                this.clearPost()
                this.postEdMod = false
            }
        },
        clearPost() {
            this.edit = false
            this.post.id = null
            this.post.title = ''
            this.post.text = ''
        }
    }
}
</script>

<style lang="scss">
.background {
    background: linear-gradient(to right top, rgba(100, 115, 201, 0.33), rgba(25, 32, 72, 0.7)),
                url('https://cdn.vuetifyjs.com/images/parallax/material2.jpg'); 
}
.title-font {
    font-family: monospace;
    font-size: 1.2em;
}
</style>