import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        routes:[],
        currentAdmin:JSON.parse(window.sessionStorage.getItem('user'))
    },
    mutations:{
        init_admin(state,admin){
            state.currentAdmin=admin;
        },
        initRoutes(state,data){
            state.routes=data;
        }
    },
    actions:{

    }
})