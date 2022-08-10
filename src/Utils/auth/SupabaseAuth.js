import config from "../../../public/config.json";
import { createClient } from "@supabase/supabase-js";
class SupabaseAuth {
    constructor() {
        this.options = {
            schema: 'public',
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        };
        this.supabase = createClient(config.api.Supabase.url, config.api.Supabase.key, this.options);
        this.auth = this.supabase.auth;
        this.authenticated = false;
        //if(SupabaseAuth._instance)
    }
    static get Instance() {
        return this._instance || new SupabaseAuth();
    }
    //jwt?: string
    async signUp(userCred, data) {
        const { user, session, error } = await this.auth.signUp({
            email: userCred.email,
            password: userCred.password,
        }, {
            data: data
        });
        return { user, session, error };
    }
    async login(providerId, userCred) {
        let provider = "google";
        let scopes;
        switch (providerId) {
            case "google":
                provider = 'google';
                scopes = '';
                break;
            case "facebook":
                provider = 'facebook';
                scopes = 'public_profile email';
                break;
            case "twitter":
                provider = 'twitter';
                scopes = '';
                break;
            default:
                if (userCred) {
                    const { user, session, error } = await this.auth.signIn({
                        email: userCred.email,
                        password: userCred.password
                    });
                    //const jwt = session?.access_token
                    this.authenticated = true;
                    return { user, session, error };
                }
                break;
        }
        const { user, session, error } = await this.auth.signIn({
            provider: provider
        }, {
            scopes: scopes
        });
        /*if (session) {
          const oAuthToken = session.provider_token // use to access provider API
        }*/
        this.authenticated = true;
        return { user, session, error };
    }
    async logout() {
        const { error } = await this.auth.signOut();
        return error;
    }
    async getUser() {
        const user = await this.auth.user();
        return user;
    }
    async isAuthenticated() {
        let sess;
        this.auth.onAuthStateChange((event, session) => {
            this.authenticated = true;
            console.log("event and session");
            console.log(event, session);
            sess = session;
        });
        console.log("session: ", sess);
        return this.authenticated;
    }
    isSignedIn() {
        let signedIn = false;
        this.auth.onAuthStateChange((event, session) => {
            if (event == 'SIGNED_IN') {
                console.log('SIGNED_IN', session);
            }
        });
        signedIn = true;
        return signedIn;
    }
    isSignedOut() {
        this.auth.onAuthStateChange((event, session) => {
            if (event == 'SIGNED_OUT')
                console.log('SIGNED_OUT', session);
        });
    }
    isDeleted() {
        this.auth.onAuthStateChange((event, session) => {
            if (event == 'USER_DELETED')
                console.log('USER_DELETED', session);
        });
    }
    async updateCred(email) {
        const { user, error } = await this.auth.update({ email: email });
        return { user, error };
    }
    async recoverPassword(email) {
        const { data, error } = await this.auth.api.resetPasswordForEmail(email);
        return { data, error };
    }
    startSession() {
        return this.auth.session()?.user;
    }
}
const auth = SupabaseAuth.Instance;
//Object.freeze(auth)
export default auth;
