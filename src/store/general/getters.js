export const isGoogleInitialized = state => {
    console.log("isGoogleInitialized: " + state.googleInit);
    return state.googleInit;
  };

  export const polygonVertices = state => {
    return state.vertices;
  };