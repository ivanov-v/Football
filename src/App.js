import React, {Component} from 'react';
import firebase from './firebase';
import moment from 'moment';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import {TimePicker} from '@atlaskit/datetime-picker';
import EmojiFrequentIcon from '@atlaskit/icon/glyph/emoji/frequent';
import {FieldTextStateless} from '@atlaskit/field-text';
import Modal from '@atlaskit/modal-dialog';
import Select from '@atlaskit/select';
import {GamerItem} from './components/GamerItem';
import {LoaderScreen} from './components/LoaderScreen';
import {MiniLoader} from './components/MiniLoader';
import {Progress} from './components/Progress';
import {Table} from './components/Table';
import just from './just.png';

const Footer = styled.footer`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 15px;
    text-align: center;
    background-color: #fafafa;
`;

const Page = styled.div`
    width: 100%;
    padding: 15px;
    padding-top: 20px;
`;

const MainForm = styled.div`
    width: 100%;
    padding-bottom: 250px;
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
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const Header = styled.header`
    background-color: #039be5;
    padding: 15px;
    padding-bottom: 0;
`;

const HeaderTitle = styled.h1`
    color: #fff;
    font-size: 22px;
    margin: 0;
    margin-bottom: 12px;
`;

const MenuButton = styled.a`
    position: relative;
    padding: 0;
    padding-bottom: 14px;
    border: none;
    outline: none;
    appearance: none;
    background: none;
    margin-right: 12px;
    box-shadow: none;
    font-size: 18px;
    color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
    cursor: pointer;
    
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4px;
        background-color: ${props => props.active ? '#fff' : 'transparent'};
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
    }
`;

const FindField = styled.div`
    display: flex;
    align-items: center;
`;

const FindText = styled(FieldTextStateless)`
    flex-grow: 1;
`;

const FindFieldButton = styled.div`
    margin-left: 6px;
`;

const FooterButtons = styled.div`
    margin-top: 12px;
`;

const ProgressStyled = styled.div`
    margin-bottom: 12px;
`;

const Empty = styled.div`
    padding: 30px 15px;
`;

const EmptyTitle = styled.div`
    font-weight: 700;
    text-align: center;
    font-size: 20px;
    margin-bottom: 18px;
`;

const EmptyImage = styled.img`
    display: block;
    width: 85%;
    max-width: 290px;
    margin: 0 auto;
`;

const GamerExistsAlert = styled.div`
    color: #FF5630;
    margin-bottom: 12px;
`;

const EventText = styled.div`
    font-size: 13px;
`;

const GamerSearch = styled.div`
    margin-bottom: 12px;
`;

const gamesRef = firebase.database().ref('games');
const gamersRef = firebase.database().ref('gamers');
const gameGamersRef = firebase.database().ref('gameGamers');

const MAX_GAMERS = 12;

const EVENTS_TEXTS = {
    CHANGE_TIME: 'изменено время',
    ADD_GAMER: 'добавлен',
    CREATE_GAME: 'создана игра',
    DELETE_GAMER: 'ливнул',
};

const getGamerRemove = state => {
    const gameGamer = state.gameGamersList.find(gameGamer => gameGamer.id === state.gameGamerRemove);
    return state.gamersList.find(gamer => gamer.id === gameGamer.gamerId);
};

const getGamersWithRating = ({gamersList, gameGamersList}) =>
    gamersList
        .map(gamer => {
            const rating = gameGamersList.filter(gameGamer => gameGamer.gamerId === gamer.id).length;

            return {
                ...gamer,
                rating,
            };
        })
        .sort((gamer1, gamer2) => gamer2.rating - gamer1.rating);

const getGameGamersForGame = state =>
    state.gameGamersList.filter(gameGamers => gameGamers.gameId === state.game.key);

const isGamerExists = ({gamersList, newGamerName}) =>
    Boolean(gamersList.find(gamer => gamer.name.toLowerCase() === newGamerName.toLowerCase()));

const getGamer = (state, id) => state.gamersList.find(gamer => gamer.id === id);

const getEventUpdatesText = state => {
    const {lastEvent} = state.game;
    const timestamp = moment(lastEvent.timestamp).format('HH:mm');
    const eventText = EVENTS_TEXTS[lastEvent.type];

    switch (lastEvent.type) {
        case 'CHANGE_TIME':
            return <EventText>В <b>{timestamp}</b> {eventText} на <b>{lastEvent.time}</b></EventText>;

        case 'DELETE_GAMER':
        case 'ADD_GAMER':
            const gamerName = getGamer(state, lastEvent.gamerId).name;

            return <EventText>В <b>{timestamp}</b> {eventText} <b>{gamerName}</b></EventText>;

        case 'CREATE_GAME':
            return <EventText>В <b>{timestamp}</b> {eventText}</EventText>;

        default:
            return null;
    }
};

const defaultState = {
    loading: false,
    loader: false,
    page: 'game',
    newGamerName: '',
    gamersList: [],
    gameGamersList: [],
    valueSelect: '',
    gameGamerRemove: '',
    gameRemove: '',
    game: {
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
        });

        gameGamersRef.on('value', gameGamersSnap => {
            this.visualUpdate();

            const gameGamersValue = gameGamersSnap.val();

            if (gameGamersValue) {
                const gameGamers = Object.keys(gameGamersValue).map(gamerId => ({
                    ...gameGamersValue[gamerId],
                    id: gamerId,
                }));

                if (gameGamers.length) {
                    this.setState({
                        gameGamersList: gameGamers,
                    });
                } else {
                    this.setState({
                        gameGamersList: [],
                    });
                }
            } else {
                this.setState({
                    gameGamersList: [],
                });
            }
        });
    }

    handleTimeInput = time => {
        const {game} = this.state;
        const timestamp = firebase.database.ServerValue.TIMESTAMP;

        firebase.database().ref().update({
            [`games/${game.key}/time`]: time,
            [`games/${game.key}/lastEvent`]: {
                type: 'CHANGE_TIME',
                timestamp,
                time,
            },
        });
    };

    handleCreateGame = () => {
        const timestamp = firebase.database.ServerValue.TIMESTAMP;
        const {game} = this.state;

        gamesRef.push({
            createTime: timestamp,
            time: game.time,
            lastEvent: {
                type: 'CREATE_GAME',
                timestamp,
                time: game.time,
            },
        });
    };

    removeGame = () => {
        const {game} = this.state;

        const updates = getGameGamersForGame(this.state).reduce((acc, gameGamer) => {
            if (game.key === gameGamer.gameId) {
                acc[`gameGamers/${gameGamer.id}`] = null;
            }

            return acc;
        }, {});

        updates[`games/${game.key}`] = null;

        firebase.database().ref().update(updates);
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

    handleClickMenu = id => evt => {
        evt.preventDefault();

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

    handleRemoveGame = () => {
        this.setState({
            gameRemove: this.state.game.key,
        });
    };

    closeRemoveGameModal = () => {
        this.setState({
            gameRemove: '',
        });
    };

    handleConfirmRemoveGameModal = () => {
        this.closeRemoveGameModal();
        this.removeGame();
    };

    handleRemoveGameGamer = id => () => {
        this.setState({
            gameGamerRemove: id,
        });
    };

    closeRemoveGameGamerModal = () => {
        this.setState({
            gameGamerRemove: '',
        });
    };

    handleConfirmRemoveGameGamerModal = () => {
        const {game} = this.state;

        this.closeRemoveGameGamerModal();

        gameGamersRef.child(this.state.gameGamerRemove).remove();

        firebase.database().ref().update({
            [`games/${game.key}/lastEvent`]: {
                type: 'DELETE_GAMER',
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                gamerId: getGamerRemove(this.state).id,
            },
        });
    };

    handleChangeGamerSelect = (valueSelect, {action}) => {
        this.setState({
            valueSelect: '',
        });
        
        if (action === 'pop-value') {
            return;
        }

        gameGamersRef.push({
            gamerId: valueSelect.value,
            gameId: this.state.game.key,
        });

        firebase.database().ref().update({
            [`games/${this.state.game.key}/lastEvent`]: {
                type: 'ADD_GAMER',
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                gamerId: valueSelect.value,
            },
        });
    };

    render() {
        const {
            game,
            loading,
            loader,
            gamersList,
            gameGamerRemove,
            gameRemove,
            page,
            valueSelect,
        } = this.state;

        const gameGamersForGame = getGameGamersForGame(this.state);

        const options = gamersList
            .filter(gamer => {
                const gameGamers = gameGamersForGame.find(gameGamers => gameGamers.gamerId === gamer.id);

                return !gameGamers;
            })
            .map(gamer => ({label: gamer.name, value: gamer.id}));

        const progress = {
            percent: gameGamersForGame.length * 100 / MAX_GAMERS,
            caption: `${gameGamersForGame.length}/${MAX_GAMERS}`,
        };

        const isGameFull = gameGamersForGame.length === MAX_GAMERS;

        const gamerExists = isGamerExists(this.state);

        const gamePage = (
            <Page>
                {!game.createTime && (
                    <Empty>
                        <EmptyTitle>
                            Игру еще никто не создал
                        </EmptyTitle>

                        <EmptyImage src={just} />
                    </Empty>
                )}

                {game.createTime && (
                    <MainForm>
                        <Row>
                            <RowTitle>Дата игры:</RowTitle>
                            <DateRow>
                                <DateRowDate>
                                    {moment(game.createTime).format('D.MM')}
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
                            <ProgressStyled>
                                <Progress percent={progress.percent} caption={progress.caption} />
                            </ProgressStyled>

                            {!isGameFull && (
                                <GamerSearch>
                                    <Select
                                        options={options}
                                        placeholder={`Добавить ${gameGamersForGame.length + 1}-го игрока`}
                                        isSearchable
                                        onChange={this.handleChangeGamerSelect}
                                        value={valueSelect}
                                        menuPlacement="bottom"
                                        maxMenuHeight={120}
                                        noOptionsMessage={() => 'Игрок не найден'}
                                    />
                                </GamerSearch>
                            )}

                            <div>
                                {gameGamersForGame.map(gameGamersItem => {
                                    const gamer = gamersList.find(gamer => gamer.id === gameGamersItem.gamerId);
                                    return (
                                        gamer &&
                                        <GamerItem
                                            key={gameGamersItem.id}
                                            name={gamer.name}
                                            onClick={this.handleRemoveGameGamer(gameGamersItem.id)}
                                        />
                                    );
                                })}
                            </div>
                        </Row>

                        {gameGamerRemove && (
                            <Modal
                                appearance="danger"
                                actions={[
                                    {text: 'Да', onClick: this.handleConfirmRemoveGameGamerModal},
                                    {text: 'Отмена', onClick: this.closeRemoveGameGamerModal},
                                ]}
                                heading="Вы уверены?"
                                onClose={this.closeRemoveGameGamerModal}
                            >
                                <p><b>{getGamerRemove(this.state).name}</b> сегодня не будет играть?</p>
                            </Modal>
                        )}

                        {gameRemove && (
                            <Modal
                                appearance="danger"
                                actions={[
                                    {text: 'Да', onClick: this.handleConfirmRemoveGameModal},
                                    {text: 'Отмена', onClick: this.closeRemoveGameModal},
                                ]}
                                heading="Вы уверены?"
                                onClose={this.closeRemoveGameModal}
                            >
                                Отменить игру?
                            </Modal>
                        )}
                    </MainForm>
                )}

                <Footer>
                    {(game.key && gamersList.length > 0) && getEventUpdatesText(this.state)}

                    {!game.key && (
                        <FooterButtons>
                            <Button
                                type="button"
                                appearance="primary"
                                onClick={this.handleCreateGame}
                            >
                                Создать игру
                            </Button>
                        </FooterButtons>
                    )}

                    {game.key && (
                        <FooterButtons>
                            <Button
                                type="button"
                                appearance="danger"
                                spacing="compact"
                                onClick={this.handleRemoveGame}
                            >
                                Отменить игру
                            </Button>
                        </FooterButtons>
                    )}
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
                                <FindText
                                    type="text"
                                    onChange={this.handleChangeGamerName}
                                    value={this.state.newGamerName}
                                    placeholder="Фамилия Имя"
                                    isLabelHidden
                                />

                                <FindFieldButton>
                                    <Button
                                        isDisabled={!this.state.newGamerName || gamerExists}
                                        onClick={this.handleAddGamer}
                                        type="button"
                                        appearance='primary'
                                    >
                                        Создать
                                    </Button>
                                </FindFieldButton>
                            </FindField>
                        </Row>

                        {gamerExists && (
                            <GamerExistsAlert>Такой игрок существует</GamerExistsAlert>
                        )}

                        <div>
                            {gamersList.map(gamer =>
                                <GamerItem
                                    key={gamer.id}
                                    name={gamer.name}
                                />
                            )}
                        </div>
                    </div>
                )}
            </Page>
        );

        const ratingPage = (
            <Page>
                <Table
                    titles={['N', 'Игрок', 'Игр']}
                    items={getGamersWithRating(this.state)}
                />
            </Page>
        );

        const pages = {
            game: gamePage,
            gamers: gamersPage,
            rating: ratingPage,
        };

        return (
            <div className="App">
                {loading && <LoaderScreen />}

                {!loading && (
                    <div>
                        {loader && <MiniLoader />}

                        <Header>
                            <HeaderTitle>Футбол</HeaderTitle>

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
                                    Игроки
                                </MenuButton>
                                <MenuButton
                                    onClick={this.handleClickMenu('rating')}
                                    active={page === 'rating'}
                                >
                                    Рейтинг
                                </MenuButton>
                            </Menu>
                        </Header>

                        {pages[page]}
                    </div>
                )}
            </div>
        );
    }
}

export default App;
