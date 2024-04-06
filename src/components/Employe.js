import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet  , FlatList , TouchableOpacity} from "react-native";
import LogoutButton from "./Logout";
import { supabase } from "../../initSupabase";



export const Card = (props) => {
  return <View style={styles.card}>{props.children}</View>;
}

export const CardContent = (props) => {
  return <View style={styles.cardContent}>{props.children}</View>;
}

export const Title = (props) => {
  return <Text style={styles.title}>{props.children}</Text>;
}



const Employee = ({ user, navigation }) => {
  const [canteens, setCanteens] = useState([]); 
  const [selectedCanteen, setSelectedCanteen] = useState(null);

  const handleCanteenPress = (id) => {
    setSelectedCanteen(id);
    navigation.navigate("Canteen Details", { canteenId: id });
  };

  const handleBooking = (meal) => {
    // Perform booking logic here
    alert(`Booking confirmed for ${meal} in canteen.`);
  };


  useEffect(() => {
    const getCanteens = async () => {
      try {
        const { data, error } = await supabase
          .from("User")
          .select("*")
          .eq("user_type", false);

        if (error) {
          console.error("Error fetching canteens:", error.message);
          alert("Error fetching canteens");
        } else {
          console.log("Canteens:", data);
          setCanteens(data);
        }
      } catch (error) {
        console.error("Error fetching canteens:", error.message);
        alert("Error fetching canteens");
      }
    };

    getCanteens();
  }, [user]);


  const renderCanteenItem = ({ item }) => {
    if (!item) {
      return <Text>Loading...</Text>;
    }
    return (
      <TouchableOpacity onPress={() => handleCanteenPress(item.id)}>
      <View style={[styles.card, selectedCanteen === item.id && styles.selectedCard]}>
        <View>
          <Title>{item.name}</Title>
          <TouchableOpacity onPress={() => handleBooking(item.name)} style={styles.bookingButton}>
            <Text>Book {item.name}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {user ? user.name : "Employee"}</Text>
      <View >
        
      {canteens.length > 0 ? (
        <FlatList
          data={canteens}
          renderItem={renderCanteenItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>Loading...</Text>
      )}
      </View>
      <LogoutButton navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    fontStyle:'italic',
    fontWeight:'bold',
    color: 'black',
  },
  card:{
    marginBottom: 15,
    color: 'black',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  cardContent:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title:{
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  bookingButton:{
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    color: 'white',
  },
  selectedCard: {
    backgroundColor: "lightblue",
  } 
});


export default Employee;
