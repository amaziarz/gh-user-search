import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
  username: string;
};

export default function SearchForm() {
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      username: '',
    },
  });
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  useEffect(() => {
    const subscription = watch(({ username }) => {
      console.log(username);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  return (
    <Box
      autoComplete="off"
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="username"
        render={({ field }) => (
          <TextField
            {...field}
            label="GitHub Username"
            placeholder="Search for a GitHub user..."
          />
        )}
      />
    </Box>
  );
}
