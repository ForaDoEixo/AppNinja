import React from 'react';
import {
  Input,
  Button,
  Icon,
  Text,
  Divider,
  Overlay,
} from 'react-native-elements';
import {
  View,
  StyleSheet,
  Image,
  AsyncStorage,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import theme from '../constants/Theme';
import Env from '../constants/Environment';

export default class SignUpScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
      isLoading: false,
      disabled: true,
    };
  }

  render() {
    return (
      <View style={theme.container}>
        <Image style={theme.logo} source={require('../assets/images/logo.png')} />
        <KeyboardAvoidingView behavior='padding' enabled style={[theme.fullContainer, {flex: 6, paddingVertical: 20}]}>
          <Input placeholder='E-mail' leftIcon={
            <Icon name='user' color='white' errorMessage='Teste de erro de mensagem' errorStyle={{color: 'red'}} />
          } onChangeText={(email) => this.setState({email}, this._checkIfEnabled)} value={this.state.email} keyboardType= 'email-address' />
          <Input containerStyle={{marginTop: 5}} placeholder='Nome Ninja' leftIcon={
            <Icon name='user' color='white' />
          } onChangeText={(username) => this.setState({username}, this._checkIfEnabled)} value={this.state.username} />
          <Input containerStyle={{marginTop: 5}} secureTextEntry placeholder='Senha' leftIcon={
            <Icon name='lock' color='white' />
          } onChangeText={(password) => this.setState({password}, this._checkIfEnabled)} value={this.state.password} />
          <Input containerStyle={{marginTop: 5}} secureTextEntry placeholder='Confirmar Senha' leftIcon={
            <Icon name='lock' color='white' />
          } onChangeText={(passwordConfirm) => this.setState({passwordConfirm}, this._checkIfEnabled)} value={this.state.passwordConfirm} />
          <Button title='CRIAR CONTA' onPress={this._signUpAsync} disabled={this.state.disabled} />
        </KeyboardAvoidingView>
        <Overlay isVisible={this.state.isLoading}>
          <ActivityIndicator size='large' color='white'/>
        </Overlay>
      </View>
    );
  }

  _signUpAsync = async () => {
    if (this.state.password !== this.state.passwordConfirm) {
      return;
    }
    this.setState({ isLoading: true });

    let response = await fetch(Env.apiUrl + 'api/account/users/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        first_name: this.state.username,
        password: this.state.password,
      }),
    });

    this.setState({ isLoading: false });

    if (!response || !response.ok) {
      showMessage({
        message: 'Erro',
        description: 'Ocorreu um erro de comunicação com o servidor',
        type: 'danger',
      });
    } else {
      let data = await response.json();

      // A requisição retorna um id caso a conta tenha sido criada
      // caso contrário, a conta já existe
      if (data.id) {
        showMessage({
          message: 'Email enviado',
          description: 'Um email foi enviado para a ativação da sua conta',
          type: 'success',
        });
        this.props.navigation.navigate('SignIn');
      } else {
        showMessage({
          message: 'Erro',
          description: 'Já existe uma conta cadastrada para este email',
          type: 'danger',
        });
      }
    }
  };

  _checkIfEnabled = () => {
    if ( this.state.email &&
      this.state.username &&
      this.state.password &&
      this.state.passwordConfirm &&
      this.state.password === this.state.passwordConfirm ) {
      this.setState({ disabled: false });
    } else {
      this.setState({ disabled: true });
    }
  };
}

