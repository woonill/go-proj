import { ContextMenu,SubMenu, Item, Separator, Submenu, ContextMenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';

const onClick = ({ event, ref, data, dataFromProvider }) => console.log('Hello');
// create your menu first
const MyAwesomeMenu = () => (
    <ContextMenu id='menu_id'>
       <Item onClick={onClick}>Lorem</Item>
       <Item onClick={onClick}>Ipsum</Item>
       <Separator />
       <Item disabled>Dolor</Item>
       <Separator />
       <Submenu label="Foobar">
        <Item onClick={onClick}>Foo</Item>
          <SubMenu>
              Foo2 
          </SubMenu>          
        <Item onClick={onClick}>Bar</Item>
       </Submenu>
    </ContextMenu>
);

export default function SubRightMenu(props){

  return (
    <div>
    <h1>Welcome to My App</h1>
    <ContextMenuProvider id="menu_id">
        <div>Some Content ... </div>
    </ContextMenuProvider>
    <MyAwesomeMenu />
</div>

  )
}


// export default function SubRightMenu(props) {
//   const { show } = useContextMenu({
//     id: MENU_ID,
//   });

//   function handleContextMenu(event){
//       event.preventDefault();
//       show(event, {
//         props: {
//             key: 'value'
//         }
//       })
//   }
//   const handleItemClick = ({ event, props }) => console.log(event,props);

//   return (
//     <div >
//     <p onContextMenu={handleContextMenu}>{props.children}</p>  
//     <Menu id={MENU_ID} theme="light" >
//       <Item onClick={handleItemClick}>Item 1</Item>
//       <Item onClick={handleItemClick}>Item 2</Item>
//       <Separator />
//       <Item disabled>Disabled</Item>
//       <Separator />
//       <Submenu label="Foobar">
//         <Item onClick={handleItemClick}>Sub Item 1</Item>
//         <Item onClick={handleItemClick}>Sub Item 2</Item>
//       </Submenu>
//     </Menu>
//     </div>
//   );
// }