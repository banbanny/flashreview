// app/tabs/reviewsection.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { loadReviewers, deleteReviewer } from '../../lib/reviewers';
import { Reviewer } from '../../lib/types';

export default function ReviewSection() {
  const router = useRouter();
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);

  useEffect(() => {
    loadReviewersList();
  }, []);

  const loadReviewersList = async () => {
    try {
      const loaded = await loadReviewers();
      setReviewers(loaded);
    } catch (error) {
      Alert.alert('Error', 'Failed to load reviewers.');
    }
  };

  const handleReview = (reviewer: Reviewer) => {
    router.push({
      pathname: '/reviewscreen' as any,
