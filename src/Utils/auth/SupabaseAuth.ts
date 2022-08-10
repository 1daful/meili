import config from "../../../public/config.json";
import { createClient, Provider } from "@supabase/supabase-js";

class SupabaseAuth implements Auth {
  private constructor() {
    //if(SupabaseAuth._instance)
  }

    options = {
      schema: 'public',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }

    private static _instance?: SupabaseAuth

    static get Instance() {
      return this._instance || new SupabaseAuth()
    }

    supabase = createClient(config.api.Supabase.url, config.api.Supabase.key, this.options);
    auth = this.supabase.auth

    authenticated: boolean = false

    //jwt?: string

    async signUp(userCred: Record<string, any>, data: Object) {
      const { user, session, error } = await this.auth.signUp(
        {
          email: userCred.email,
          password: userCred.password,
        },
        {
          data: data
        }
      )
      return { user, session, error }
    }

    async login(providerId?: string, userCred?: Record<string, any>) {
        let provider: Provider = "google"
        let scopes
        switch (providerId) {
            case "google" :
                provider = 'google'
                scopes = ''
                break;
            case "facebook" :
                provider = 'facebook'
                scopes = 'public_profile email'
                break;
            case "twitter" :
                provider = 'twitter'
                scopes = ''
                break;
        
            default:
              if (userCred) {
                const { user, session, error } = await this.auth.signIn({
                    email: userCred.email,
                    password: userCred.password
                  })
              //const jwt = session?.access_token
              this.authenticated = true
              return {user, session, error}
              }
                break;
        }
        const { user, session, error } = await this.auth.signIn({
            provider: provider
          }, {
            scopes: scopes
          })
          /*if (session) {
            const oAuthToken = session.provider_token // use to access provider API
          }*/
          this.authenticated = true
          return {user, session, error}
    }
    async logout() {
        const { error } = await this.auth.signOut()
        return error
    }
    async getUser() {
      const user = await this.auth.user()
      return user
    }
    async isAuthenticated() {
      let sess
      this.auth.onAuthStateChange((event, session) => {
        this.authenticated = true
        console.log("event and session")
        console.log(event, session)
        sess = session
      })
      console.log("session: ", sess)
      return this.authenticated
    }

    isSignedIn() {
      let signedIn = false
      this.auth.onAuthStateChange((event, session) => {
        if (event == 'SIGNED_IN'){
          console.log('SIGNED_IN', session)
        }
      })
      signedIn = true
      return signedIn
    }

    isSignedOut() {
      this.auth.onAuthStateChange((event, session) => {
        if (event == 'SIGNED_OUT') console.log('SIGNED_OUT', session)
      })
    }

    isDeleted() {
      this.auth.onAuthStateChange((event, session) => {
        if (event == 'USER_DELETED') console.log('USER_DELETED', session)
      })
    }

    async updateCred(email : string) {
        const { user, error } = await this.auth.update({email: email})
        return { user, error }
    }

    async recoverPassword(email: string) {
      const { data, error } = await this.auth.api.resetPasswordForEmail(email)
      return { data, error }
    }

    startSession() {
      return this.auth.session()?.user
    }

}

const auth = SupabaseAuth.Instance
//Object.freeze(auth)
export default auth