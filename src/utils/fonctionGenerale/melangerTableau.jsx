function melangerTableau(tab){
    const nouveauTableau = [...tab];
    for (let i = nouveauTableau.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nouveauTableau[i], nouveauTableau[j]] = [nouveauTableau[j], nouveauTableau[i]];
      }
      return nouveauTableau;
}

export default melangerTableau