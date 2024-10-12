/* eslint-disable no-useless-catch */
import conf from '../conf/conf.js'
import {Client, Account, ID} from "appwrite"

export class AuthService{
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client)
    }

    async createAccount({email, password, name}){
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // call another function
                this.login({email, password});
            } else{
                return userAccount;
            }
        } catch (error) {
            console.log("Appwrite service :: create account :: error", error);;
        }
    }

    async login({email, password}){
        try{
            await this.account.createEmailPasswordSession(email, password);
        } catch(error){
            console.log("Appwrite service :: login :: error", error);
        }
    }

    async getCurrentUser(){
        try{
            return await this.account.get();
        } catch (error){
            throw error;
        }
        return null; // if there is no account
    }

    async logout(){
        try{
            await this.account.deleteSessions()
        } catch (error){
            console.log("Appwrite service :: login :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService