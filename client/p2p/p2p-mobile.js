import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useRouteContext } from '../route/router';
import { useMediaQuery } from '../layout/useMediaQuery';
export default function PeerToPeerMobile() {
  const [route, setRoute] = useRouteContext();
  const { width } = useMediaQuery();
  useEffect(() => {
    if (width < 800) {
      setRoute('/contacts');
    }
  }, []);

  return <div>PeerToPeerMobile</div>;
}
