import {Language, useLanguage} from '@/i18n/useLanguage';
import {colors, radius, spacing} from '@/theme';
import ScreenLayout from '@/ui/ScreenLayout';
import {useTranslation} from 'react-i18next';
import {Pressable, StyleSheet, Text, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';

function LanguagePicker() {
  const {t} = useTranslation();
  const {language, languages, setLanguage} = useLanguage();
  const navigation = useNavigation();
  const renderItem = (l: Language) => {
    return (
      <Pressable
        style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
        onPress={() => {
          setLanguage(l.code);
          navigation.goBack();
        }}>
        <Text style={styles.label}>{l.label}</Text>
        {l.code === language && <Text style={styles.check}>✓</Text>}
      </Pressable>
    );
  };
  return (
    <ScreenLayout title={t('settings.language')}>
      <FlatList
        data={languages}
        renderItem={({item}) => renderItem(item)}
        contentContainerStyle={styles.list}
      />
    </ScreenLayout>
  );
}

export default LanguagePicker;

const styles = StyleSheet.create({
  list: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  rowPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  label: {
    color: colors.text,
    fontSize: 16,
  },
  check: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },
});
