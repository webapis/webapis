import { h } from "preact";
import Layout from "./Layout";
import { Delete } from "icons/Delete";
import { Archive } from "icons/Archive";
import { Block } from "icons/Block";
import Button from "controls/button";
const style = {
  iconBtn: { display: "flex", alignItems: "center", margin: 8 },
  btn: { marginRight: 8 },
  btnContainer: {
    display: "flex",
    flexDirection: "column",
  },
  layout: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  btnOk: {
    margin: 8,
    display: "flex",
    justifyContent: "flex-end",
  },
};

export default function Configure({
  onBlock,
  onDelete,
  onArchive,
  onNotification,
  onConversationHistory,
  onNavigation,
  onOk,
}) {
  return (
    <Layout style={style.layout}>
      <div>
        <Checkbox label="Notifications" onChange={onNotification} />
        <Checkbox
          label="Conversation History"
          onChange={onConversationHistory}
        />
      </div>
      <hr />
      <div style={style.btnContainer}>
        <IconButton title="Archive" Icon={Archive} onClick={onArchive} />
        <IconButton title="Delete" Icon={Delete} onClick={onDelete} />
        <IconButton
          id="bckui"
          title="Block"
          Icon={Block}
          onClick={onNavigation}
        />
      </div>
      <div>
        <Button onClick={onOk} title="OK" bg="primary" />
      </div>
    </Layout>
  );
}

function IconButton({ Icon, title, onClick, id }) {
  return (
    <div style={style.iconBtn}>
      <button
        id={id}
        style={style.btn}
        onClick={onClick}
        data-testid={`${id}-btn`}
      >
        <Icon id={id} />
      </button>
      <div>{title}</div>
    </div>
  );
}

function Checkbox({ label, onChange }) {
  return (
    <div style={{ margin: 8, marginTop: 8 }}>
      <input type="checkbox" onChange={onChange} />
      <label>{label}</label>
    </div>
  );
}
