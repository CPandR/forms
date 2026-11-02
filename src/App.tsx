import { useEffect } from 'react';
import { Route, Routes, useParams } from 'react-router';
import { ErrorPage } from './components/ErrorPage';
import { Layout } from './components/Layout';
import { exeForm } from './forms/exe';
import { hadForm } from './forms/had';
import type { FormDefinition } from './forms/types';
import { QuestionnairePage } from './pages/QuestionnairePage';

const FormRoute = ({ form }: { form: FormDefinition }) => {
  const { id = '' } = useParams();
  return <QuestionnairePage key={id} form={form} id={id} />;
};

const NotFound = () => {
  useEffect(() => {
    document.title = 'CP+R';
  }, []);
  return <ErrorPage />;
};

export const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="had_form/:id" element={<FormRoute form={hadForm} />} />
      <Route path="exe_form/:id" element={<FormRoute form={exeForm} />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);
