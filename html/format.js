/**
 * Created by USER on 2016-07-28.
 */
if(!String.prototype.format){
    String.prototype.format = function(){
        var args = arguments;
        return this.replace(/{(\d+)}/g,function(match,number){
            return typeof args[number] != 'undefined'? args[number]
                :match;
        })
    }
}