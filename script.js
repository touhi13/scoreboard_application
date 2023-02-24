// select dom elements
const allMatchContainer = document.getElementsByClassName("all-matches")[0];
const addMatchEl = document.getElementsByClassName("lws-addMatch")[0];
const resetBtnEl = document.getElementsByClassName("lws-reset")[0];

// action identifiers
const INCREMENT = "increment";
const DECREMENT = "decrement";
const ADD_MATCH = "addMatch";
const RESET_BOARD = "resetBoard";

// action creators
// increase board
const increment = (score) => {
    return {
        type: INCREMENT,
        payload: score,
    }
}
//decrease board
const decrement = (score) => {
    return {
        type: DECREMENT,
        payload: score,
    }
}
//Add match
const addMatch = () => {
    return {
        type: ADD_MATCH
    }
}
//Reset all matches
const resetBoards = () => {
    return {
        type: RESET_BOARD,
    }
}
//initial state
const initialState = {
    scoreboards: [
        {
            id: 1,
            value: 0
        }
    ]
}

//create reducer function
function scoreboardReducer(state = initialState, action) {
    if (action.type === INCREMENT) {
        return {
            ...state,
            scoreboards: state.scoreboards.map((board) =>
                board.id === action.payload.id
                    ? { ...board, value: board.value + action.payload.value }
                    : { ...board }
            )
        }
    } else if (action.type === DECREMENT) {
        return {
            ...state,
            scoreboards: state.scoreboards.map((board) =>
                board.id === action.payload.id
                    ? { ...board, value: Math.sign(board.value - action.payload.value) === +1 ? board.value - action.payload.value : 0 }
                    : { ...board }
            )
        }
    } else if (action.type === ADD_MATCH) {
        return {
            ...state,
            scoreboards: [
                ...state.scoreboards,
                {
                    id: state.scoreboards.length + 1,
                    value: 0
                }
            ]
        }
    } else if (action.type === RESET_BOARD) {
        return {
            ...state,
            scoreboards: state.scoreboards.map((board) => ({
                ...board,
                value: 0
            }))
        }
    } else {
        return state;
    }
}

// create store
const store = Redux.createStore(scoreboardReducer);

//render
const render = () => {
    const state = store.getState();
    allMatchContainer.innerHTML = "";
    state.scoreboards.forEach((board, i) => {
        const matchEl = `<div class="match">
            <div class="wrapper">
                <button class="lws-delete" data-board-number="${board.id}">
                    <img src="./image/delete.svg" alt="">
                </button>
                <h3 class="lws-matchName">Match ${board.id}</h3>
            </div>
            <div class="inc-dec">
                <form class="incrementForm">
                    <h4>Increment</h4>
                    <input type="number" name="increment" data-board-number="${board.id}" class="lws-increment">
                </form>
                <form class="decrementForm">
                    <h4>Decrement</h4>
                    <input type="number" name="decrement" data-board-number="${board.id}" class="lws-decrement">
                </form>
            </div>
            <div class="numbers">
                <h2 class="lws-singleResult">${board.value}</h2>
            </div>
        </div>`;

        allMatchContainer.innerHTML += matchEl;

    })
}
render();

//add match event handler
addMatchEl.addEventListener("click", () => {
    store.dispatch(
        addMatch()
    )
});

//reset scoreboard event handler
resetBtnEl.addEventListener("click", () => {
    store.dispatch(
        resetBoards()
    )
});

//increase & decrease scoreboard event handler
const inputClassNames = ["lws-increment", "lws-decrement"];
updateScoreEvent(inputClassNames);

function updateScoreEvent(inputClassNames) {
    document.addEventListener('keypress', function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            const score = {
                id: parseInt(e.target.getAttribute("data-board-number")),
                value: parseFloat(e.target.value)
            }

            const targetEl = hasClass(e.target, inputClassNames);
            if (targetEl === "lws-increment" && isNaN(score.value) !== true) {
                store.dispatch(
                    increment(score)
                );
            } else if (targetEl === "lws-decrement" && isNaN(score.value) !== true) {
                store.dispatch(
                    decrement(score)
                );
            } else if (isNaN(score.id) !== true && isNaN(score.value) !== false) {
                alert("You are entering empty value.Please enter number value!!!")
            } else {
                return false;
            }
        }
    }, false);
}
//utility function for checking specific class name
function hasClass(elem, classNames) {
    for (let i = 0; i < classNames.length; i++) {
        if (elem.className.split(' ').indexOf(classNames[i]) > -1) {
            return classNames[i];
        } else {
            continue;
        }
    }
    return false;
}

//subscribe to redux store
store.subscribe(render)

