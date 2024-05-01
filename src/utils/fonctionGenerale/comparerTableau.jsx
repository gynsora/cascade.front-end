//cette fonction permet de comparer des tableaux avec des valeur identiques mais pas forcement dans le meme ordre
function comparerTableau(tab1, tab2) {
    if (tab1.length !== tab2.length) {
        return false;
    }
    const sortedArray1 = tab1.slice().sort();
    const sortedArray2 = tab2.slice().sort();
    for (let i = 0; i < sortedArray1.length; i++) {
        if (sortedArray1[i] !== sortedArray2[i]) {
            return false;
        }
    }
    return true;
}

export default comparerTableau