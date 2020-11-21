module.exports={

isEMpty:function (obj) {

    for(let key in obj){
if(obj.hasOwnProperty(key)){
    return false
}else{
    return true
}
    }
    
}

}