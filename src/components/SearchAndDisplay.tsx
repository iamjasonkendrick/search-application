import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Todo } from "../types/todo";

interface SearchFormValues {
  search: string;
}

const SearchAndDisplay: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async (searchQuery: string = ""): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<Todo[]>(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const data = response.data;
      setTodos(data);
      if (searchQuery) {
        const filtered = data.filter((todo) =>
          todo.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTodos(filtered);
      } else {
        setFilteredTodos(data);
      }
    } catch (err) {
      setError("Error fetching data. Please try again.");
    }
    setIsLoading(false);
  };

  const validationSchema = Yup.object().shape({
    search: Yup.string().required("Search query is required"),
  });

  const handleSubmit = (
    values: SearchFormValues,
    { setSubmitting }: FormikHelpers<SearchFormValues>
  ): void => {
    fetchTodos(values.search);
    setSubmitting(false);
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4 min-w-[700px]">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="bg-zinc-800/50 rounded-lg p-4">
          <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
          <div className="mt-2 flex items-center">
            <div className="h-6 w-20 bg-zinc-700 rounded-full"></div>
            <div className="ml-2 h-4 w-10 bg-zinc-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 shadow-lg rounded-lg text-zinc-100 min-w-[800px]">
      <h1 className="text-4xl font-bold mb-8 text-center text-zinc-300">
        Todo Search
      </h1>
      <Formik
        initialValues={{ search: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="mb-8">
            <div className="flex items-center justify-center">
              <Field
                type="text"
                name="search"
                placeholder="Search todos"
                className="w-full max-w-md px-4 py-2 text-zinc-200 bg-zinc-800 border border-zinc-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-zinc-100 bg-zinc-600 rounded-r-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 transition duration-150 ease-in-out"
              >
                {isSubmitting ? "Searching..." : "Search"}
              </button>
            </div>
            <ErrorMessage
              name="search"
              component="div"
              className="mt-2 text-center text-red-400 text-sm"
            />
          </Form>
        )}
      </Formik>

      {isLoading ? (
        <SkeletonLoader />
      ) : error ? (
        <p className="text-center text-red-400 bg-red-900/50 border border-red-700 rounded p-3">
          {error}
        </p>
      ) : (
        <div>
          {filteredTodos.length > 0 ? (
            <ul className="space-y-4">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="bg-zinc-800/50 shadow-sm rounded-lg p-4 hover:shadow-md transition duration-150 ease-in-out"
                >
                  <h2 className="text-lg font-semibold text-zinc-100">
                    {todo.title}
                  </h2>
                  <div className="mt-2 flex items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        todo.completed
                          ? "bg-green-900/50 text-green-300"
                          : "bg-red-900/50 text-red-300"
                      }`}
                    >
                      {todo.completed ? "Completed" : "Not Completed"}
                    </span>
                    <span className="ml-2 text-sm text-zinc-400">
                      ID: {todo.id}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-zinc-400 bg-zinc-800/50 rounded p-4">
              No results found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndDisplay;
