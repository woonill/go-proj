import { Button, Popover } from "antd";

//import { SettingOutlined,MailOutlined } from "@ant-design/icons";

import {
  ContextMenu,
  SubMenu,
  MenuItem,
  ContextMenuTrigger,
} from "react-contextmenu";
import "./react-contextmenu.css";

//const { SubMenu } = Menu;
// function SchedulerItem(props) {
//     const menu = (
//       <Menu>
//         <Menu.Item key="1">1st menu item</Menu.Item>
//         <Menu.Item key="2">2nd menu item</Menu.Item>
//         <Menu.Item key="3">3rd menu item</Menu.Item>
//       </Menu>
//     );

//     return (
//       <Dropdown overlay={menu} trigger={["contextMenu"]}>
//         <Button
//           style={{
//             width: "100%",
//             height: "100%",
//             backgroundColor: "red",
//             borderStyle: "none",
//           }}
//         >
//           {props.text}
//         </Button>

//       </Dropdown>
//     );
//   }

// function SchedulerItem2(props) {
//   return (
//     <Popover content={props.fReversionTime} title="예약시간">
//       <Button
//         style={{
//           width: "100%",
//           height: "100%",
//           backgroundColor: "red",
//           borderStyle: "none",
//         }}
//       >
//         {props.text}
//       </Button>
//     </Popover>
//   );
// }

// export default function NewMenu(props) {
//   return (
//     <Menu style={props.style} mode="vertical">
//       <SubMenu key="sub1" title={props.text}>
//         <Menu.ItemGroup title="Item 1">
//           <Menu.Item key="1">Option 1</Menu.Item>
//           <Menu.Item key="2">Option 2</Menu.Item>
//         </Menu.ItemGroup>
//         <Menu.ItemGroup title="Iteom 2">
//           <Menu.Item key="3">Option 3</Menu.Item>
//           <Menu.Item key="4">Option 4</Menu.Item>
//         </Menu.ItemGroup>
//       </SubMenu>
//     </Menu>
//   );
// }

export default function NewMenu(props) {
  // return (

  //     <Popover content={props.fReversionTime} title="예약시간">

  //         <Menu style={props.style} mode="vertical">
  //                 <SubMenu key="sub1" title={props.text}>
  //                 <Menu.ItemGroup title="Item 1">
  //                     <Menu.Item key="1">Option 1</Menu.Item>
  //                     <Menu.Item key="2">Option 2</Menu.Item>
  //                 </Menu.ItemGroup>
  //                 <Menu.ItemGroup title="Iteom 2">
  //                     <Menu.Item key="3">Option 3</Menu.Item>
  //                     <Menu.Item key="4">Option 4</Menu.Item>
  //                 </Menu.ItemGroup>
  //                 </SubMenu>
  //             </Menu>

  //   </Popover>

  // );
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
            key="s-key-2"
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
    <SubMenu key="s-key-1" title={title}>
    {
      menus.map((el) =>  {

        return (
          <MenuItem
            onClick={eventDispacher}
            key="s-key-2"
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

function MouseRightMenu(props) {

  let sArray = [
    {text:"결제내역",data:{}},
    {text:"잠감결제",data:{}}
  ]

  let fArray = [
    {text:"상세보기",data:{}},
    {text:"객실이동",data:{}},
    {text:"기간연장",data:{}},
    {text:"퇴실확정",data:{}},
    {text:"계약일수정",data:{}}
  ]

  let tArray = [
    {text:"환별",data:{}},
    {text:"에약삭제",data:{}},
  ]


  return (
    <div>
      {/* <div className="well">Right click to see the menu</div> */}
      <ContextMenuTrigger id={props.menuId}>
        <div className='pure-menu pure-menu-horizontal'>
              {props.children}
          </div>            
      </ContextMenuTrigger>

      <ContextMenu id={props.menuId}>
        <SubMenu key="s-key-1" title="예약">
            {newMenuList(fArray,props.handleClick)}
        </SubMenu>
        {newSubMenuList("결제",sArray,props.handleClick)}
        <SubMenu key="s-key-1" title="취소">
            {newMenuList(tArray,props.handleClick)}
        </SubMenu>
      </ContextMenu>
    </div>
  );
}

export { MouseRightMenu };
