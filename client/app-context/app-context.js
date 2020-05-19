import { h, createContext } from 'preact';
import { useContext } from 'preact/hooks';
import accept_inv_img_png from './img/accept_invitation.png';
const AppContext = createContext();

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used with AppProvider');
  }
  const { title, accept_inv_img } = context;
  return { title, accept_inv_img };
}
//
export function AppProvider(props) {
  const { title, accept_inv_img = accept_inv_img_png } = props;

  return <AppContext.Provider value={{ title, accept_inv_img }} {...props} />;
}
