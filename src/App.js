import React, {Component} from 'react';
import firebase from './firebase';
import moment from 'moment';
import styled from 'styled-components';
import './App.css';
import Button, { ButtonGroup } from '@atlaskit/button';
import {TimePicker} from '@atlaskit/datetime-picker';
import EmojiFrequentIcon from '@atlaskit/icon/glyph/emoji/frequent';
import {FieldTextStateless} from '@atlaskit/field-text';
import Modal from '@atlaskit/modal-dialog';
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

const MainForm = styled.div`
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
    loading: false,
    loader: false,
    page: 'game',
    newGamerName: '',
    gamersList: [],
    waitingConfirm: false,
    game: {
        updateTime: null,
        createTime: null,
        key: null,
        time: '21:00',
    },
};

class App extends Component {
    state = {
        ...defaultState,
        loading: true,
    };

    componentDidMount() {
        gamesRef.limitToLast(1).on('value', lastGameSnapshot => {
            this.visualUpdate();

            const gameValue = lastGameSnapshot.val();

            if (gameValue) {
                const key = Object.keys(gameValue)[0];
                const gameData = gameValue[key];

                if (moment().isSame(gameData.createTime, 'day')) {
                    this.setState({
                        game: {
                            ...gameData,
                            key,
                        },
                        loading: false,
                    });
                } else {
                    this.setState({
                        game: {
                            ...defaultState.game,
                        },
                        loading: false,
                    });
                }
            } else {
                this.setState({
                    game: {
                        ...defaultState.game,
                    },
                    loading: false,
                });
            }
        });

        gamersRef.on('value', gamersSnap => {
            const gamersValue = gamersSnap.val();

            this.visualUpdate();

            if (gamersValue) {
                const gamersList = Object.keys(gamersValue).map(gamerId => ({
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

    handleTimeInput = time => {
        const {game} = this.state;

        firebase.database().ref().update({
            [`games/${game.key}/time`]: time,
            [`games/${this.state.game.key}/updateTime`]: firebase.database.ServerValue.TIMESTAMP,
        });
    };

    handleCreateGame = () => {
        const timestamp = firebase.database.ServerValue.TIMESTAMP;

        gamesRef.push({
            updateTime: timestamp,
            createTime: timestamp,
            time: this.state.game.time,
        });
    };

    handleDeleteGame = () => {
        this.setState({
            waitingConfirm: true,
        });
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

    handleCloseModal = () => {
        this.setState({
            waitingConfirm: false,
        });
    };

    handleConfirmModal = () => {
        this.setState({
            waitingConfirm: false,
        });

        gamesRef.child(this.state.game.key).remove();
    };

    render() {
        const {
            game,
            loading,
            loader,
            gamersList,
            page,
            waitingConfirm,
        } = this.state;

        const gamePage = (
            <Page>
                {!game.createTime && (
                    <p>Игру еще никто не создал, или ее отменили.</p>
                )}

                {game.createTime && (
                    <MainForm>
                        <Row>
                            <RowTitle>Дата игры:</RowTitle>
                            <DateRow>
                                <DateRowDate>
                                    {game.createTime && moment(game.createTime).format('D.MM')}
                                </DateRowDate>
                                <DateRowTime>
                                    <TimePicker
                                        onChange={this.handleTimeInput}
                                        times={['19:00', '20:00', '21:00']}
                                        timeFormat="HH:mm"
                                        value={game.time}
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

                        {waitingConfirm && (
                            <Modal
                                appearance="danger"
                                actions={[
                                    { text: 'Да', onClick: this.handleConfirmModal },
                                    { text: 'Нет', onClick: this.handleCloseModal },
                                ]}
                                heading="Вы уверены?"
                                onClose={this.handleCloseModal}
                            >
                                <p>Отменяем игру на сегодня?</p>
                            </Modal>
                        )}
                    </MainForm>
                )}

                <Footer>
                    {game.updateTime && `Обновлено в ${moment(game.updateTime).format('HH:mm')}`}
                    <br />
                    <br />
                    <ButtonGroup>
                        {game.key && (
                            <Button
                                type="button"
                                appearance="danger"
                                onClick={this.handleDeleteGame}
                            >
                                Отменить игру
                            </Button>
                        )}

                        {!game.key && (
                            <Button
                                type="button"
                                onClick={this.handleCreateGame}
                            >
                                Создать игру
                            </Button>
                        )}
                    </ButtonGroup>
                </Footer>
            </Page>
        );

        const gamersPage = (
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

                        {page === 'game' ? gamePage : gamersPage}
                    </div>
                )}
            </div>
        );
    }
}

export default App;
