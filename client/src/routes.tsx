import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { PageLayout } from './layout/PageLayout.tsx';
import { Movie } from './pages/Movie.tsx';
import { Movies } from './pages/Movies.tsx';
import { NotFound } from './pages/NotFound.tsx';
import { Watchlist } from './pages/Watchlist.tsx';

export const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<PageLayout />}>
        <Route path='/' element={<Movies />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movie/:id' element={<Movie />} />
        <Route path='/watchlist' element={<Watchlist />} />
      </Route>
      <Route element={<PageLayout />}>
        <Route path='*' element={<NotFound />} />
      </Route>
    </>,
  ),
);
