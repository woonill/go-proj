import { Button, Popover } from "antd";

//import { SettingOutlined,MailOutlined } from "@ant-design/icons";

import {
  ContextMenu,
  SubMenu,
  MenuItem,
  ContextMenuTrigger,
} from "react-contextmenu";
import "./react-contextmenu.css";



export default function NewMenu(props) {

  return (
    <Popover content={props.fReversionTime} title="예약시간">
      <Button
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "red",
          borderStyle: "none",
        }}
      >
        {props.text}
      </Button>
    </Popover>
  );
}


function newMenuList(menus,eventDispacher) {

  return (
    <>
    {
      menus.map((el) =>  {

        return (
          <MenuItem
            onClick={eventDispacher}
            data={el.data}
          >
            {el.text}
          </MenuItem>
        )
      })
    }
    </>
  )
}

function newSubMenuList(title,menus,eventDispacher) {

  return (
    <SubMenu  title={title}>
    {
      menus.map((el) =>  {

        return (
          <MenuItem
            onClick={eventDispacher}
            data={el.data}
          >
            {el.text}
          </MenuItem>
        )
      })
    }
  </SubMenu>
  )
}


function newMouseRightMenu(fArray,sArray,tArray) {


  return function(props) {

    return (
      <div>
        {/* <div className="well">Right click to see the menu</div> */}
        <ContextMenuTrigger id={props.menuId}>
          <div className='pure-menu pure-menu-horizontal'>
                {props.children}
            </div>            
        </ContextMenuTrigger>
  
        <ContextMenu id={props.menuId}>
          <SubMenu title="예약">
              {newMenuList(fArray,props.handleClick)}
          </SubMenu>
          {newSubMenuList("결제",sArray,props.handleClick)}
          <SubMenu title="취소">
              {newMenuList(tArray,props.handleClick)}
          </SubMenu>
        </ContextMenu>
      </div>
    );  
  }
}

export {newMouseRightMenu };
