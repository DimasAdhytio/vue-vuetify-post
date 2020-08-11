<template>
    <v-main class="background">
        <v-row>
            <v-container>
                <v-row class="justify-center fill-height">
                    <v-col md="4" cols="11">
                        <v-card class="mt-10">
                            <v-col class="d-flex mt-15 pb-0 justify-center">
                                <v-avatar size="100px" color="grey" class="mt-n15">
                                    <v-icon size="75px" class="mdi-light">mdi-account</v-icon>
                                </v-avatar>
                            </v-col>
                            <v-card-title class="justify-center font-weight-bold">
                                LOGIN
                            </v-card-title>
                            <v-card-text>
                                <v-form>
                                    <v-text-field
                                        outlined
                                        prepend-inner-icon="mdi-account"
                                        type="email"
                                        v-model="form.email"
                                        :rules="[form.required,form.emailVal]"
                                        autofocus
                                    ></v-text-field>
                                    <v-text-field
                                        outlined
                                        prepend-inner-icon="mdi-key"
                                        :append-icon="form.showPass ? 'mdi-eye' : 'mdi-eye-off'"
                                        :type="form.showPass ? 'password': 'text'"
                                        v-model="form.pass"
                                        :rules="[form.required]"
                                        @click:append="form.showPass = !form.showPass"
                                    ></v-text-field>
                                    <v-btn block color="primary">Submit</v-btn>
                                    <v-btn block color="red" dark class="mt-3">Cancel</v-btn>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-row>
    </v-main>
</template>

<script>
export default {
    name: 'login',
    data() {
        return {
            form: {
                email: 'sada@asd',
                pass: 'sadas',
                showPass: false,
                required: value => !!value || "Please don't leave it empty",
                emailVal: v => /.+@.+/.test(v) || 'E-mail must be valid'
            }
        }
    }
    
}
</script>

<style lang="scss">
.background {
    background: linear-gradient(to right top, rgba(100, 115, 201, 0.33), rgba(25, 32, 72, 0.7)),
                url('https://cdn.vuetifyjs.com/images/parallax/material2.jpg'); 
}
.trans {
    background: rgba(255,255,255,0.5);
}
</style>