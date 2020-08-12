<template>
    <v-main>
        <v-btn @click="onLogout" color="red" dark>Logout</v-btn>
    </v-main>
</template>

<script>
export default {
    methods: {
        onLogout() {
            this.$store.dispatch('logout')
            .then(response => {
                this.$router.push({name:'Login'})
                console.log(response);
            })
        }
    }
}
</script>