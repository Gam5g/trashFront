import React, { createContext, useContext, useReducer } from "react";
// 해당 파일은 로그인 및 로그아웃이 됨과 동시에 상태를 전역적으로 알려주는 것임.
// 예 : header의 로그인과 로그아웃, 커뮤니티 글쓰기 on/off = 로그인상태/로그아웃상태
const initialState = {
  isLoggedIn: false,
};

// header에서 받아오는 type에 따라 전역변수인 isLoggedIn의 값이 달라짐.
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};

// createContext : 전역으로 쓰이게 될 변수들을 관리해줌. State(상태)와 dispatch(위치)
const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

// useReducer : action에 따라서 상태를 업데이트함.
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    // State~~는 인증 상태 정보를 제공, Dispatch~~는 인증 액션 정보를 제공.
    // value prop으로 현재 상태 또는 dispatch 함수를 하위 컴포넌트로 전달
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

export function useAuthState() {
  const context = useContext(AuthStateContext);
  return context;
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  return context;
}

export { authReducer };
