import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Check, ArrowRight, Loader2 } from "lucide-react";

interface Question {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
}

interface QuizQuestion {
  currentQuestion: number;
  questions: Question[];
}

const mockQuestions: Question[] = [
  {
    id: 1,
    text: "Which of these activities do you enjoy the most?",
    options: [
      { id: "a", text: "Analyzing data and discovering patterns" },
      { id: "b", text: "Building and designing physical objects" },
      { id: "c", text: "Writing and communicating ideas" },
      { id: "d", text: "Working with people and helping them" }
    ]
  },
  {
    id: 2,
    text: "When solving a problem, you prefer to:",
    options: [
      { id: "a", text: "Follow a systematic, logical approach" },
      { id: "b", text: "Think outside the box and find creative solutions" },
      { id: "c", text: "Collaborate with others to find the best solution" },
      { id: "d", text: "Research thoroughly before making a decision" }
    ]
  },
  {
    id: 3,
    text: "Which subject did you enjoy most in school?",
    options: [
      { id: "a", text: "Mathematics and Computer Science" },
      { id: "b", text: "Art, Design or Music" },
      { id: "c", text: "Social Sciences (Psychology, Sociology)" },
      { id: "d", text: "Natural Sciences (Physics, Chemistry, Biology)" }
    ]
  },
  {
    id: 4,
    text: "In a group project, which role do you usually take?",
    options: [
      { id: "a", text: "The organizer who plans everything" },
      { id: "b", text: "The creative one who comes up with ideas" },
      { id: "c", text: "The leader who directs the team" },
      { id: "d", text: "The analyst who researches and provides information" }
    ]
  },
  {
    id: 5,
    text: "What kind of work environment do you prefer?",
    options: [
      { id: "a", text: "Structured with clear goals and objectives" },
      { id: "b", text: "Flexible and adaptable with new challenges" },
      { id: "c", text: "Collaborative with lots of teamwork" },
      { id: "d", text: "Independent where I can work at my own pace" }
    ]
  }
];

interface CareerQuizProps {
  userId: number;
  onComplete: (result: any) => void;
}

export default function CareerQuiz({ userId, onComplete }: CareerQuizProps) {
  const [quizState, setQuizState] = useState<QuizQuestion>({
    currentQuestion: 0,
    questions: mockQuestions
  });
  
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentSelection, setCurrentSelection] = useState<string | null>(null);
  
  const generateRecommendationMutation = useMutation({
    mutationFn: async (quizAnswers: { questionId: number; answerId: string }[]) => {
      const response = await apiRequest("POST", "/api/career-recommendations", {
        answers: quizAnswers
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Save the quiz result
      saveQuizResultMutation.mutate({
        userId,
        quizType: "Career Assessment",
        result: { answers },
        recommendedCareer: data.career,
        recommendedNiches: data.niches
      });
    }
  });
  
  const saveQuizResultMutation = useMutation({
    mutationFn: async (quizResult: any) => {
      const response = await apiRequest("POST", "/api/quiz-results", quizResult);
      return response.json();
    },
    onSuccess: (data) => {
      onComplete(data);
    }
  });
  
  const handleOptionSelect = (optionId: string) => {
    setCurrentSelection(optionId);
  };
  
  const handleNext = () => {
    if (currentSelection) {
      // Save current answer
      setAnswers(prev => ({
        ...prev,
        [quizState.questions[quizState.currentQuestion].id]: currentSelection
      }));
      
      // Move to next question or finish quiz
      if (quizState.currentQuestion < quizState.questions.length - 1) {
        setQuizState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1
        }));
        setCurrentSelection(null);
      } else {
        // Quiz completed, generate recommendations
        const formattedAnswers = Object.entries(answers).map(([questionId, answerId]) => ({
          questionId: parseInt(questionId),
          answerId
        }));
        
        // Add the last answer
        formattedAnswers.push({
          questionId: quizState.questions[quizState.currentQuestion].id,
          answerId: currentSelection
        });
        
        generateRecommendationMutation.mutate(formattedAnswers);
      }
    }
  };
  
  const currentQuestion = quizState.questions[quizState.currentQuestion];
  const progress = ((quizState.currentQuestion + 1) / quizState.questions.length) * 100;
  
  const isLoading = generateRecommendationMutation.isPending || saveQuizResultMutation.isPending;

  if (isLoading) {
    return (
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Analyzing Your Responses</CardTitle>
          <CardDescription>
            Our AI is processing your answers to find the perfect career match...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
          <p className="text-gray-600">This will only take a moment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-xl">Career Assessment Quiz</CardTitle>
          <span className="text-sm font-medium">
            Question {quizState.currentQuestion + 1} of {quizState.questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent>
        <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
        
        <RadioGroup 
          value={currentSelection || ""} 
          onValueChange={handleOptionSelect} 
          className="space-y-3"
        >
          {currentQuestion.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={option.id} 
                id={`option-${option.id}`} 
                className="border-gray-300"
              />
              <Label 
                htmlFor={`option-${option.id}`} 
                className="text-gray-700 cursor-pointer flex-1 p-2 rounded-md hover:bg-gray-50"
              >
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!currentSelection}
          className="bg-primary hover:bg-primary/90"
        >
          {quizState.currentQuestion < quizState.questions.length - 1 ? (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Complete
              <Check className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
