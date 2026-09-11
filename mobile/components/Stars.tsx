import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

interface StarsProps {
  rating: number;
  size?: number;
}

export default function Stars({ rating, size = 14 }: StarsProps) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name="star"
          size={size}
          color={star <= Math.round(rating) ? Colors.amber : Colors.sandDark + '50'}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 1,
  },
});
