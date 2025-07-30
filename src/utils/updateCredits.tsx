import { supabase } from "./supabase";

export const decrementCredit = async (n:number) => {
 const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('users')
    .update({ credits: n-1 })
    .eq('id', user?.id);

    console.log("decrement ", n, "  ", data )
};