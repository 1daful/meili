<template>
  <!-- Navbar -->
    <div class="navbar mb-2 shadow-lg">
        <div class="flex-none px-2 mx-2">
            <span class="text-lg font-bold">
                {{site.name}}
            </span>
        </div>
        <div class="flex-1 px-2 mx-2">
            <div class="items-stretch hidden lg:flex" v-for="route in routes" :key="route.name">
                <router-link v-if="route.meta.navigational" :to="route.path" class="btn btn-ghost rounded-btn">
                    {{route.name}}
                </router-link>
            </div>
        </div>
        <div class="flex justify-end" v-if="user">
            <button @click="logout()" class="btn btn-ghost">
                Logout
            </button>
        </div>
        <div v-else>
            <button @click="login()" class="btn btn-ghost"> Login </button>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import config from "../../public/config.json";
    
    import Api from '../Utils/auth/SupabaseAuth'

    export default defineComponent({
        name: 'Navbar',
        setup() {
            const site = config.site
            const router = useRouter()
            const routes = router.getRoutes()
            const user = ref(null)

            const getUser = async () => {
                return await Api.getUser()
            }

            const login = () => {
                router.push('Login')
            }

            const logout = () => {
                Api.logout()
                    .then(() => {
                        router.push({name: 'Home'})
                    })
            }

            return {
                user,
                login,
                logout,
                site,
                routes
            }
        }
    })
</script>
