import {getRequest} from "@/utils/api";
import router from "@/router";
import dynamicRoutes from "core-js/stable/dom-collections";

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }

    getRequest('/system/cfg/menu').then(data => {
        if (data) {
            //格式化Router
            let fmtRoutes = formatRoutes(data);
            //添加到Router
            //router.addRoutes(fmtRoutes);
            for (let i = 0, length = fmtRoutes.length; i < length; i += 1) {
                const element = fmtRoutes[i];
                router.addRoute(element);
            }
            //将数据存入vuex
            store.commit('initRoutes', fmtRoutes);
        }
    })
}

export const formatRoutes = (routes) => {
    let fmtRoutes = []
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            iconCls,
            children
        } = router;
        if (children && children instanceof Array) {
            children = formatRoutes(children);
        }
        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            children: children,
            component(resolve) {
                if (component.startsWith('Home')) {
                    require(['../views/' + component + '.vue'], resolve);
                } else if (component.startsWith('Exp')) {
                    require(['../views/exp/' + component + '.vue'], resolve);
                } else if (component.startsWith('Info')) {
                    require(['../views/info/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sys')) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                } else if (component.startsWith('Treat')) {
                    require(['../views/treat/' + component + '.vue'], resolve);
                } else if (component.startsWith('Wit')) {
                    require(['../views/wit/' + component + '.vue'], resolve);
                } else if (component.startsWith('Patient')) {
                    require(['../views/patient/' + component + '.vue'], resolve);
                }
            }
        }
        fmtRoutes.push(fmRouter)
    })
    return fmtRoutes;
}