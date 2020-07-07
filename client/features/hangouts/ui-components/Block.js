import { h } from "preact";
import Layout from "./Layout";
import Button from "controls/button";
const style = {
  checkbox: { marginRight: 8 },
  checkboxRoot: {
    display: "flex",
    alignItems: "center",
    padding: 16,
  },
  layout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    boxSizing: "border-box",
    paddingTop: 68,
  },
  btn: {
    flex: 1,
    marginRight: 4,
  },
};

export default function Block({ onCancel, onBlock, onReport }) {
  return (
    <Layout style={style.layout}>
      <div style={style.checkboxRoot}>
        <input type="checkbox" style={style.checkbox} onChange={onReport} />
        <label>Report</label>
      </div>
      <div className="row">
        <div className="col">
          <Button
            data-testid="cancel-btn"
            onClick={onCancel}
            title="Cancel"
            bg="secondary"
            outline
            block
          />
        </div>

        <div className="col">
          <Button
            id="BLOCK"
            onClick={onBlock}
            data-testid="block-btn"
            title="Block"
            bg="primary"
            block
          />
        </div>
      </div>
    </Layout>
  );
}
