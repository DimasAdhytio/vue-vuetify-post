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
                    <v-btn v-on="on" v-bind="attrs" class="ml-auto">orang <v-icon>mdi-menu-down</v-icon></v-btn>
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
                            color="warning"
                            dark
                            @click="edStat()"
                        >
                        Edit
                        </v-btn>

                        <v-btn
                            color="red"
                            dark
                            @click="delStat()"
                            class="ml-2"
                        >
                        Delete
                        </v-btn>
                        </v-card-title>

                        <v-divider></v-divider>

                        <v-virtual-scroll
                        :items="this.$store.state.post"
                        :item-height="90"
                        height="500"
                        >
                        <template v-slot="{ item }">
                            <v-list-item :class="{grey : item.id % 2 == 0}">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <v-row>
                                            <v-col class="text-truncate">
                                                {{ item.title }}
                                            </v-col>
                                            <v-col v-if="!deleteStat" class="text-right">
                                                {{ item.id }} | {{ item.username }}
                                            </v-col>
                                            <v-btn v-else fab x-small class="mr-6 red lighten-1" elevation="0" @click="modDel(item.id)">
                                                <v-icon class="mdi-light">mdi-close</v-icon>
                                            </v-btn>
                                        </v-row>
                                    </v-list-item-title>
                                    <hr>
                                    <v-list-item-title>{{ item.body }}item</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                        </v-virtual-scroll>
                        <v-card-text class="grey darken-4 white--text">
                            <h2>Post Input</h2>
                            <h4 v-if="edit">
                                <v-avatar tile color="warning" height="20px" class="mt-1">Edit</v-avatar>
                                <v-avatar width="70px" height="20px" class="mt-1" tile>Id Post : </v-avatar>
                            </h4>
                            <v-form class="mt-6">
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
                                <v-btn color="success" @click="inPost()">Post</v-btn>
                                <v-btn color="red" class="white--text ml-2" @click="clearPost()">Clear</v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
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
    </v-main>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            deleteStat: false,
            editStat: false,
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
        ...mapState(['showPost'])
    },
    methods: {
        delStat() {
            this.deleteStat = !this.deleteStat
        },
        onLogout() {
            this.$store.dispatch('logout')
            .then(response => {
                this.$router.push({name:'Login'})
                console.log(response);
            })
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
            this.$store.dispatch('inPost',{
                title: this.post.title,
                text: this.post.text
            })
            this.clearPost()
        },clearPost() {
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