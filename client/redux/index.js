import { combineReducers } from 'redux';
import entities from './entities';
import pages from './pages';

const reducers = combineReducers({
  entities,
  pages,
});

export default reducers;
