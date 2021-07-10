import React,{useState} from "react";
import { Modal,Button } from 'antd';

// class PopupViewWrapper extends React.Component {
//   state = { visible: false };

//   showModal = () => {
//     this.setState({
//       visible: true,
//     });
//   };

//   handleOk = e => {
//     console.log(e);
//     this.setState({
//       visible: false,
//     });
//   };

//   handleCancel = e => {
//     console.log(e);
//     this.setState({
//       visible: false,
//     });
//   };

//   render() {
//     return (
//       <>
//         {/* <Button type="primary" onClick={this.showModal}>
//           Open Modal with customized button props
//         </Button> */}
//         <Modal
//           title="Basic Modal"
//           visible={this.state.visible}
//           onOk={this.handleOk}
//           onCancel={this.handleCancel}
//           okButtonProps={{ disabled: true }}
//           cancelButtonProps={{ disabled: true }}
//         >
//           {this.props.children}
//         </Modal>
//       </>
//     );
//   }
// }


  // showModal = () => {
  //   this.setState({
  //     visible: true,
  //   });
  // };

  // handleOk = e => {
  //   console.log(e);
  //   this.setState({
  //     visible: false,
  //   });
  // };




function PopupViewWrapper(props) {

  console.log(props)
  let visibleStte = props.visible;

  return (
    <>
      {/* <Button type="primary" onClick={this.showModal}>
        Open Modal with customized button props
      </Button> */}
      <Modal
        title="Basic Modal"
        visible={visibleStte}
        onOk={props.handleOk}
        onCancel={props.handleCancel}
        okButtonProps={{ disabled: true }}
        cancelButtonProps={{ disabled: true }}
      >
        {props.children}
      </Modal>
    </>
  );
}


function PopupView(props) {


    return (

        <Modal
          title="Basic Modal"
          visible={props.visible}
          onOk={props.handleCancel}
          onCancel={props.handleCancel}
          okButtonProps={{ disabled: false }}
          cancelButtonProps={{ disabled: false }}
        >
          {props.children}
        </Modal>
    );
}


// function PopupView(props) {

//   let [showPopupState, setShowPopup] = useState(false);


//     return (
//       <>
//         <Button onClick={(e)=> setShowPopup(true)}>Test</Button>

//         <Modal
//           title="Basic Modal"
//           visible={showPopupState}
//           onOk={(e)=>{
//             setShowPopup(false)
//           }}
//           onCancel={(e)=>{
//             setShowPopup(false)
//           }}
//           okButtonProps={{ disabled: false }}
//           cancelButtonProps={{ disabled: false }}
//         >
//           {props.children}
//         </Modal>
//         </>
//     );
// }




class PopupComp extends React.Component {

  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render(){

    return (

      <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okButtonProps={{ disabled: true }}
          cancelButtonProps={{ disabled: true }}
        >
          {this.props.children}
        </Modal>
  );


  }
}


export {
    PopupViewWrapper,
    PopupView,
    PopupComp
}