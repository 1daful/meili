<template>
    <div>
        <AuthLayout>
            <h1 class="text-gray-800 font-bold text-2xl mb-8 text-center">Create you account!</h1>
            <div class="flex items-center border border-gray-300 py-3 px-3 rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-person w-5 h-5 text-gray-400" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg>
                <input v-model="form.name" class="pl-2 outline-none border-none" type="text" placeholder="Name"/>
            </div>
            <div class="flex items-center border border-gray-300 py-3 px-3 rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-at w-6 h-6 text-gray-400" viewBox="0 0 16 16"><path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"/></svg>
                <input v-model="form.email" class="pl-2 outline-none border-none" type="email" placeholder="Email"/>
            </div>
            <div class="flex items-center border border-gray-300 py-3 px-3 rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-lock w-5 h-5 text-gray-400" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/></svg>
                <input v-model="form.password" class="pl-2 outline-none border-none" type="password" placeholder="Password"/>
            </div>
            <div class="flex items-center border border-gray-300 py-3 px-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-lock w-5 h-5 text-gray-400" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/></svg>
                <input v-model="form.password_confirmation" class="pl-2 outline-none border-none" type="password" placeholder="Password confirmation"/>
            </div>
            <div v-if="error" class="text-red-500 text-sm text-center w-full p-4 bg-red-100 rounded-md mt-4">
                Registration error, please check your data and try again.
            </div>
            <button v-if="processing" disabled class="btn btn-primary btn-block loading disabled mt-4 mb-2">
                Create account
            </button>
            <button v-else @click="submit()" type="submit" class="btn btn-primary btn-block mt-4 mb-2">
                Create account
            </button>
            <router-link :to="{name: 'Login'}" class="hover:text-blue-500 cursor-pointer">
                Already have an account?
            </router-link>
        </AuthLayout>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import Api from '../../Utils/auth/SupabaseAuth'
    import AuthLayout from '../../Layouts/Auth.vue'

    export default defineComponent({
        name: 'Login',
        components: {
            AuthLayout,
        },
        setup() {
            const processing = ref(false)
            const error = ref(false)
            const router = useRouter()

            const form = ref({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
            })

            const submit = async () => {
                processing.value = true
                error.value = false

                Api.signUp({email: form.value.email, password: form.value.password}, {name: form.value.name})
                    .then(() => {
                        processing.value = false
                        router.push({name: 'Dashboard'})
                    })
                    .catch(() => {
                        error.value = true
                        processing.value = false
                    })
            }

            return { form, submit, processing, error }
        },
    })
</script>
