import { h } from 'preact';

const style = {
  boxShadow: `0px 3px 3px -2px rgba(0, 0, 0, 0.2),
    0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)`,
  margin: 8,
  padding: 8,
};

export function Paper(props) {
  const { children } = props;
  return <div style={style}>{children}</div>;
}
