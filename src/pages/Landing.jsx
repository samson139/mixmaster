import React from 'react'
import { useLoaderData } from 'react-router-dom';
import axios from 'axios';
import CocktailList from '../components/CocktailList';
import SearchForm from "../components/SearchForm";

const cocktailSearchUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

import { useQuery } from '@tanstack/react-query';

const searchCocktailsQuery = (searchTerm) => {
  return {
    queryKey: ['search', searchTerm || 'all'],
    queryFn: async () => {
      const response = await axios.get(`${cocktailSearchUrl}${searchTerm}`);
      return response.data.drinks;
    }
  }
}
export const loader =
  (queryClient) =>
    async ({ request }) => {
      const url = new URL(request.url)
      try {
        const searchTerm = url.searchParams.get('search') || '';
        await queryClient.ensureQueryData(searchCocktailsQuery(searchTerm))
        return {/* drinks: response.data.drinks*/ searchTerm };

      }
      catch (err) {
        console.log("error encountered is - - ", err);
      }
    }
const Landing = () => {
  const { /*drinks,*/ searchTerm } = useLoaderData();
  const { data: drinks, isLoading } = useQuery(searchCocktailsQuery(searchTerm))
  console.log(drinks);

  if (isLoading) return <h4>Loading...</h4>;
  return (
    <>
      <SearchForm searchTerm={searchTerm} />
      <CocktailList drinks={drinks} />
    </>

  )
}

export default Landing;
