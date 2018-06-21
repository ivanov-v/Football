import React, {Component} from 'react';
import firebase from './firebase';
import moment from 'moment';
import styled from 'styled-components';
import './App.css';
import Button, { ButtonGroup } from '@atlaskit/button';
import {TimePicker} from '@atlaskit/datetime-picker';
import EmojiFrequentIcon from '@atlaskit/icon/glyph/emoji/frequent';
import {FieldTextStateless} from '@atlaskit/field-text';
import {GamerItem} from './components/GamerItem';
import {LoaderScreen} from './components/LoaderScreen';
import {MiniLoader} from './components/MiniLoader';

const Footer = styled.footer`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    text-align: center;
`;

const Page = styled.div`
    width: 100%;
    padding-top: 20px;
`;

const MainForm = styled.form`
    display: block;
    width: 100%;
`;

const Row = styled.div`
    margin-bottom: 10px;
`;

const RowTitle = styled.div`
    font-weight: 600;
    margin-bottom: 6px;
`;

const DateRow = styled.div`
    display: flex;
    align-items: center;
`;

const DateRowDate = styled.div`
    margin-right: 10px;
`;

const DateRowTime = styled.div`
    width: 100px;
`;

const Menu = styled.div`
    border-bottom: 2px solid rgb(235, 236, 240);
    display: flex;
`;

const MenuButton = styled.button`
    padding: 6px;
    border: none;
    outline: none;
    appearance: none;
    border-bottom: 2px solid ${props => props.active ? 'rgb(0, 82, 204)' : 'rgb(235, 236, 240)'};
    background: none;
    margin-right: 3px;
    margin-bottom: -2px;
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.active ? 'rgb(0, 82, 204)' : 'rgb(66, 82, 110)'};
`;

const FindField = styled.div`
    display: flex;
`;

const FindFieldButton = styled.div`
    margin-left: 6px;
`;

const gamesRef = firebase.database().ref('games');
const gamersRef = firebase.database().ref('gamers');

const defaultState = {
    time: '21:00',
    key: '',
    loading: false,
    updateTime: '',
    page: 'game',
};

class App extends Component {
    state = {
        time: '21:00',
        key: '',
        loading: true,
        page: 'game',
        newGamerName: '',
    };

    handleTimeInput = value => {
        this.setState({
            time: value,
        });
    };

    handleSubmit = evt => {
        evt.preventDefault();

        gamesRef.limitToLast(1).once('value').then(lastGameSnapshot => {
            const game = lastGameSnapshot.val();

            if (!game) {
                const newGameRef = gamesRef.push();

                newGameRef
                    .set({
                        createTime: firebase.database.ServerValue.TIMESTAMP,
                        time: this.state.time,
                    });
            } else {
                if (moment().isSame(game.createTime, 'day')) {
                    const key = Object.keys(game)[0];
                    const updates = {};
                    updates[`games/${key}/time`] = this.state.time;
                    updates[`games/${key}/updateTime`] = firebase.database.ServerValue.TIMESTAMP;

                    firebase.database().ref().update(updates);
                }
            }
        });
    };

    handleDelete = () => {
        gamesRef.child(this.state.key).remove();
    };

    visualUpdate = () => {
        this.setState({
            loader: true,
        });

        setTimeout(() => {
            this.setState({
                loader: false,
            });
        }, 1800);
    };

    handleClickMenu = id => () => {
        if (this.state.page === id) {
            return;
        }

        this.setState({
            page: id,
        });
    };

    handleChangeGamerName = evt => {
        this.setState({
            newGamerName: evt.target.value,
        });
    };

    handleAddGamer = () => {
        gamersRef.push({
            name: this.state.newGamerName,
        });

        this.setState({
            newGamerName: '',
        });
    };

    handleGamerDelete = id => () => {
        gamersRef.child(id).remove();
    };

    componentDidMount() {
        gamesRef.limitToLast(1).on('value', lastGameSnapshot => {
            this.visualUpdate();

            const game = lastGameSnapshot.val();

            if (game) {
                const key = Object.keys(game)[0];
                const gameData = game[key];

                if (moment().isSame(gameData.createTime, 'day')) {
                    this.setState({
                        ...gameData,
                        loading: false,
                        key,
                    });
                }
            } else {
                this.setState(defaultState);
            }
        });

        gamersRef.on('value', gamersSnap => {
            const gamers = gamersSnap.val();

            this.visualUpdate();

            if (gamers) {
                const gamersList = Object.keys(gamers).map(gamerId => ({
                    ...gamersSnap.val()[gamerId],
                    id: gamerId,
                }));

                this.setState({
                    gamersList,
                });
            } else {
                this.setState({
                    gamersList: [],
                });
            }
        })
    }

    render() {
        const {
            time,
            createTime,
            updateTime,
            key,
            loading,
            loader,
            gamersList,
            page
        } = this.state;

        const game = (
            <Page>
                <MainForm onSubmit={this.handleSubmit}>
                    {/*<FieldTextStateless*/}
                        {/*label="Stateless Text Input Example"*/}
                        {/*onChange={this.setValue}*/}
                        {/*value={this.state.value}*/}
                    {/*/>*/}
                    <Row>
                        <RowTitle>Дата игры:</RowTitle>
                        <DateRow>
                            <DateRowDate>
                                {moment(createTime).format('D.MM')}
                            </DateRowDate>
                            <DateRowTime>
                                <TimePicker
                                    onChange={this.handleTimeInput}
                                    times={['19:00', '20:00', '21:00']}
                                    timeFormat="HH:mm"
                                    value={time}
                                    timeIsEditable
                                    icon={EmojiFrequentIcon}
                                />
                            </DateRowTime>
                        </DateRow>
                    </Row>

                    <Row>
                        <RowTitle>Сегодня играют:</RowTitle>
                        Иванов Вадим
                        <br />
                        Петров Олег
                    </Row>

                    <Footer>
                        {updateTime && `Обновлено в ${moment(updateTime).format('HH:mm')}`}
                        <br />
                        <br />
                        <ButtonGroup>
                            {key && (
                                <Button
                                    type="button"
                                    appearance="danger"
                                    onClick={this.handleDelete}
                                >
                                    Отменить игру
                                </Button>
                            )}

                            <Button
                                type="submit"
                                appearance={key ? 'default' : 'primary'}
                            >
                                {key ? 'Обновить игру' : 'Создать игру'}
                            </Button>
                        </ButtonGroup>
                    </Footer>
                </MainForm>
            </Page>
        );

        const gamers = (
            <Page>
                {gamersList && (
                    <div>
                        <Row>
                            <RowTitle>Имя нового игрока:</RowTitle>
                            <FindField>
                                <FieldTextStateless
                                    type="text"
                                    onChange={this.handleChangeGamerName}
                                    value={this.state.newGamerName}
                                    isLabelHidden
                                />

                                <FindFieldButton>
                                    <Button
                                        isDisabled={!this.state.newGamerName}
                                        onClick={this.handleAddGamer}
                                        type="button"
                                        appearance='primary'
                                    >
                                        Создать
                                    </Button>
                                </FindFieldButton>
                            </FindField>
                        </Row>
                        <div>
                            {gamersList.map(gamer =>
                                <GamerItem key={gamer.id} name={gamer.name} onClick={this.handleGamerDelete(gamer.id)} />
                            )}
                        </div>
                    </div>
                )}
            </Page>
        );

        return (
            <div className="App">
                {loading && <LoaderScreen />}

                {!loading && (
                    <div>
                        {loader && <MiniLoader />}

                        <Menu>
                            <MenuButton
                                onClick={this.handleClickMenu('game')}
                                active={page === 'game'}
                            >
                                Игра
                            </MenuButton>
                            <MenuButton
                                onClick={this.handleClickMenu('gamers')}
                                active={page === 'gamers'}
                            >
                                Доступные игроки
                            </MenuButton>
                        </Menu>

                        {page === 'game' ? game : gamers}
                    </div>
                )}
            </div>
        );
    }
}

export default App;
