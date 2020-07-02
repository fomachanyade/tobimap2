/**
 * 定数・共用関数を定義するファイル
 */
export const contant = {
    /**
     * 2つのオブジェクトの値が等しいかを比較
     */
    isEqual : (a:Object,b:Object)=> {
        if(!a || !b){
            return false;
        }
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        aKeys.forEach(aKey => {
            if(!bKeys.includes(aKey)){
                return false;
            }
            if(a[aKey] !== b[aKey]){
                return false;
            }
        });
        return true;
    }
}