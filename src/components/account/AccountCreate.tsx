import * as React from 'react';

import {connect} from "react-redux";
import {Button, Divider, Form, Header, Icon, Label, Message, Modal} from "semantic-ui-react";

import {BaseAccount, ConfigSchema, DefaultProps, EVMLDispatch, keystore, Store} from "../../redux";
import {withAlert} from "react-alert";

export interface AccountCreateLocalProps extends DefaultProps {
    // redux states
    isLoading: boolean;
    response: string;
    error: string,
    config: ConfigSchema

    // thunk action handlers
    handleCreateAccount: (password: string) => Promise<BaseAccount[]>;
}

interface State {
    open: boolean;
    password: string;
    verifyPassword: string;
    errorState: string;
}

class AccountCreate extends React.Component<AccountCreateLocalProps, any & State> {
    public state = {
        open: false,
        password: '',
        verifyPassword: '',
        errorState: ''
    };

    public open = () => this.setState({open: true});
    public close = () => this.setState({open: false});

    public handleChangeVerifyPassword = (e: any) => {
        this.setState({password: e.target.value});
    };

    public handleChangePassword = (e: any) => {
        this.setState({verifyPassword: e.target.value});
    };

    public handleCreate = () => {
        this.setState({errorState: ''});

        const {password, verifyPassword} = this.state;

        if (!password || !verifyPassword) {
            this.setState({errorState: 'Fields must not be empty!'});
            return;
        }
        if (password !== verifyPassword) {
            this.setState({errorState: 'Password do not match!'});
            return;
        }

        this.close();
        this.props.handleCreateAccount(password)
            .then(() => {
                if (this.props.response) {
                    this.props.alert.success('Account created!');
                } else {
                    this.props.alert.error('Error: ' + this.props.error);
                }
            })
    };

    public render() {
        const {errorState} = this.state;
        const {isLoading, config} = this.props;
        return (
            <React.Fragment>
                <Modal open={this.state.open} onClose={this.close} trigger={<Button color={"green"} onClick={this.open} basic={false}><Icon name="plus"/>Create</Button>}>
                    <Modal.Header>Create an Account</Modal.Header>
                    <Modal.Content>
                        <Header as={"h4"}>
                            Information
                        </Header>
                        Enter a password to encrypt your account. The created account will be placed in the keystore
                        directory specified in the configuration tab. If you would like to create the account in a
                        different
                        directory, update the configuration for keystore. <br/><br/>
                        <Label>
                            Keystore
                            <Label.Detail>{config && config.storage.keystore}</Label.Detail>
                        </Label><br/><br/>
                        <Divider/>
                        {!isLoading && (errorState) && (<Modal.Content>
                            <Message icon={true} error={true}>
                                <Icon name={"times"}/>
                                <Message.Content>
                                    <Message.Header>
                                        Oops! {errorState}
                                    </Message.Header>
                                </Message.Content>
                            </Message>
                        </Modal.Content>)}<br />
                        <Modal.Description>
                            <Form>
                                <Form.Field>
                                    <label>Password: </label>
                                    <input onChange={this.handleChangePassword}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Verify Password: </label>
                                    <input onChange={this.handleChangeVerifyPassword}/>
                                </Form.Field>
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.close}>Close</Button>
                        {isLoading && (<span className={"m-2"}>
                            <Icon color={"green"} name={"circle notch"} loading={true}/> Creating...</span>)}
                        <Button onClick={this.handleCreate} color={"green"} type='submit'>Create</Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store) => ({
    ...store.keystore.create,
    config: store.config.read.response
});

const mapDispatchToProps = (dispatch: EVMLDispatch<string, string>) => ({
    handleCreateAccount: (password: string) => dispatch(keystore.handleCreateThenFetch(password)),
});

export default connect(mapStoreToProps, mapDispatchToProps)(withAlert(AccountCreate));