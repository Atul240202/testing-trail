import React from 'react';
import { Text, View } from 'react-native';

interface QuestionHeaderProps {
  question: string;
  highlightWord?: string;
  highlightColor?: string;
  subtitle?: string;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  question,
  highlightWord,
  highlightColor = 'text-orange-600',
  subtitle,
}) => {
  const renderQuestion = () => {
    if (!highlightWord) {
      return (
        <Text 
          className="text-center text-3xl leading-10 text-black"
          style={{ fontFamily: 'Inter_28pt-SemiBold', fontWeight: '600' }}
        >
          {question}
        </Text>
      );
    }

    const parts = question.split(highlightWord);
    return (
      <Text 
        className="text-center text-3xl leading-10 text-black"
        style={{ fontFamily: 'Inter_28pt-SemiBold', fontWeight: '600' }}
      >
        {parts[0]}
        <Text className={highlightColor}>{highlightWord}</Text>
        {parts[1]}
      </Text>
    );
  };

  return (
    <View>
      <View className="mb-4">{renderQuestion()}</View>
      {subtitle && (
        <View className="mb-8">
          <Text className="text-center text-base text-gray-600">
            {subtitle}
          </Text>
        </View>
      )}
    </View>
  );
};

export default QuestionHeader;
