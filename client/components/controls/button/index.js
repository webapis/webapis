import { h } from 'preact';

export default function Button(props) {
  const { title, bg="light",outline, size,loading=false, block} = props;
  
  return (
    <button className= {`${bg && !outline&&`btn btn-${bg}`} ${outline&&`btn btn-outline-${bg}`} ${size&&`btn btn-${size}`} ${block  && 'btn-block'}`} {...props} disabled={loading}>
        {loading && <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} 
        { loading ? 'wait...':title}
    </button>
  );
}
