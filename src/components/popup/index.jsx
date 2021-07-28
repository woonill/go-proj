import React from "react";
import { Modal } from 'antd';

function PopupViewWrapper(props) {

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

    console.log(props)
    return (

        <Modal
          width={props.size.width}
          heigt={props.size.heigt}
          title={props.title}
          visible={props.visible}
          onOk={props.handleCancel}
          onCancel={props.handleCancel}
          okButtonProps={{ disabled: true,visible:false }}
          cancelButtonProps={{ disabled: true,visible:false }}
          footer={null}
        >
          {props.children}
        </Modal>
    );
}

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