import Api from '@/services/Api'

export default {
    index() {
        return Api().get('cats')
    },
    show(catId){
        return Api().get('cat/'+catId)
    },
    post(cat){
        return Api().post('cat',cat)
    },
    put(cat){
        return Api().put('cat/'+cat.id,cat)
    },
    delete(cat){
        return Api().delete('cat/'+cat.id,cat)
    },
}